// Google Cloud Functions: Dify API呼び出し（Firebase経由）
// この関数はFirebase Storageに保存された画像を取得し、Dify APIに送信します

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const { Storage } = require('@google-cloud/storage');

// Firebase Admin初期化
admin.initializeApp();
const storage = new Storage();

/**
 * 食事分析用のCloud Function
 * フロントエンドから呼び出され、Firebase Storageの画像を取得してDify APIに送信
 */
exports.analyzeMeal = functions.https.onCall(async (data, context) => {
  try {
    // 認証チェック（必要に応じて）
    // if (!context.auth) {
    //   throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
    // }

    const { textDescription, photoPath, mealType } = data;

    // バリデーション
    if (!textDescription && !photoPath) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '食事の説明または写真が必要です'
      );
    }

    // 環境変数からDify設定を取得
    const DIFY_API_KEY = functions.config().dify?.api_key;
    const DIFY_ENDPOINT = functions.config().dify?.endpoint || 'https://api.dify.ai/v1/chat-messages';

    if (!DIFY_API_KEY) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Dify API key not configured'
      );
    }

    // Firebase Storageから画像を取得（photoPathがある場合）
    let photoBase64 = null;
    let photoUrl = null;

    if (photoPath) {
      try {
        const bucket = storage.bucket();
        const file = bucket.file(photoPath);
        
        // ファイルが存在するか確認
        const [exists] = await file.exists();
        if (!exists) {
          throw new functions.https.HttpsError(
            'not-found',
            '画像ファイルが見つかりません'
          );
        }

        // 画像をダウンロードしてBase64に変換
        const [fileBuffer] = await file.download();
        photoBase64 = fileBuffer.toString('base64');
        
        // 公開URLを取得（オプション）
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491', // 長期間有効
        });
        photoUrl = signedUrl;

      } catch (error) {
        console.error('Firebase Storage error:', error);
        // 画像取得エラーは続行（テキストのみで分析）
      }
    }

    // Dify APIへのリクエストを構築
    const difyPayload = {
      inputs: {
        text: textDescription || '',
        meal_type: mealType || '',
      },
      query: textDescription || '食事を分析してください',
      response_mode: 'blocking',
      conversation_id: '',
      user: context.auth?.uid || 'anonymous-user',
    };

    // 画像がある場合は追加
    if (photoBase64) {
      difyPayload.inputs.photo = photoBase64;
      difyPayload.inputs.photo_url = photoUrl; // URLも送信（Difyが対応している場合）
    }

    // Dify APIを呼び出し
    const difyResponse = await axios.post(DIFY_ENDPOINT, difyPayload, {
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30秒タイムアウト
    });

    // Difyのレスポンスをパース
    const result = parseDifyResponse(difyResponse.data, textDescription);

    // 結果をFirebase Firestoreに保存（オプション）
    if (context.auth) {
      try {
        await admin.firestore().collection('meal_logs').add({
          userId: context.auth.uid,
          mealType: mealType,
          textDescription: textDescription,
          photoPath: photoPath,
          analysis: result,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (dbError) {
        console.error('Firestore save error:', dbError);
        // データベース保存エラーは無視して続行
      }
    }

    return result;

  } catch (error) {
    console.error('Function Error:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      'サーバーエラーが発生しました',
      error.message
    );
  }
});

/**
 * 画像アップロード用のCloud Function
 * フロントエンドから画像を受け取り、Firebase Storageに保存
 */
exports.uploadMealPhoto = functions.https.onCall(async (data, context) => {
  try {
    // 認証チェック（必要に応じて）
    // if (!context.auth) {
    //   throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
    // }

    const { imageBase64, fileName, contentType } = data;

    if (!imageBase64) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '画像データが必要です'
      );
    }

    // Base64データをバッファに変換
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // ファイル名を生成
    const userId = context.auth?.uid || 'anonymous';
    const timestamp = Date.now();
    const fileExtension = fileName?.split('.').pop() || 'jpg';
    const storageFileName = `meal-photos/${userId}/${timestamp}.${fileExtension}`;

    // Firebase Storageにアップロード
    const bucket = storage.bucket();
    const file = bucket.file(storageFileName);

    await file.save(imageBuffer, {
      metadata: {
        contentType: contentType || 'image/jpeg',
        metadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // 公開URLを取得
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return {
      photoPath: storageFileName,
      photoUrl: signedUrl,
    };

  } catch (error) {
    console.error('Upload Error:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      '画像のアップロードに失敗しました',
      error.message
    );
  }
});

/**
 * Difyのレスポンスをアプリで使用する形式に変換
 */
function parseDifyResponse(difyData, userDescription) {
  const rawOutput = difyData.answer || difyData.message || '';
  
  let parsedData;
  try {
    // レスポンスからJSONを抽出
    const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)\s*```/) || 
                     rawOutput.match(/```\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      parsedData = JSON.parse(rawOutput);
    }
  } catch (e) {
    // JSON形式でない場合は、テキストから情報を抽出
    parsedData = extractNutritionInfo(rawOutput);
  }

  return {
    menu: parsedData.menu || userDescription || '食事',
    calories: parsedData.calories || parsedData.cal || 0,
    pfc: {
      p: parsedData.pfc?.p || parsedData.protein || parsedData.p || 0,
      f: parsedData.pfc?.f || parsedData.fat || parsedData.f || 0,
      c: parsedData.pfc?.c || parsedData.carbs || parsedData.c || 0,
    },
    salt: parsedData.salt || parsedData.sodium || 0,
    advice: parsedData.advice || parsedData.comment || '',
    raw_output: rawOutput,
  };
}

/**
 * テキストから栄養情報を抽出（フォールバック）
 */
function extractNutritionInfo(text) {
  const caloriesMatch = text.match(/カロリー[：:]\s*(\d+)/);
  const proteinMatch = text.match(/タンパク質[：:]\s*(\d+)/);
  const fatMatch = text.match(/脂質[：:]\s*(\d+)/);
  const carbsMatch = text.match(/炭水化物[：:]\s*(\d+)/);

  return {
    calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 0,
    pfc: {
      p: proteinMatch ? parseInt(proteinMatch[1]) : 0,
      f: fatMatch ? parseInt(fatMatch[1]) : 0,
      c: carbsMatch ? parseInt(carbsMatch[1]) : 0,
    },
    salt: 0,
    advice: text,
  };
}

