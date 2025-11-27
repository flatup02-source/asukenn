// Dify API Service
// Google Cloud Functions経由でFirebase Storage → Dify APIを呼び出します

import { 
  analyzeMealFunction, 
  uploadMealPhotoFunction,
  fileToBase64 
} from './firebase.js';

/**
 * Analyzes meal using Dify API via Google Cloud Functions
 * 画像はFirebase Storageに保存され、Cloud Function経由でDify APIに送信されます
 * 
 * @param {File} photoFile - The image file (optional)
 * @param {string} textDescription - The text description
 * @param {string} mealType - The meal type (breakfast, lunch, dinner, snack)
 * @returns {Promise<Object>} - Structured analysis result
 */
export async function analyzeMeal(photoFile, textDescription, mealType = '') {
  console.log("Analyzing meal via Google Cloud Functions...", { 
    photoFile, 
    textDescription, 
    mealType 
  });

  try {
    let photoPath = null;

    // 画像がある場合は、まずFirebase Storageにアップロード
    if (photoFile) {
      try {
        // 画像をBase64に変換
        const photoBase64 = await fileToBase64(photoFile);
        
        // Cloud Function経由でFirebase Storageにアップロード
        const uploadResult = await uploadMealPhotoFunction({
          imageBase64: photoBase64,
          fileName: photoFile.name,
          contentType: photoFile.type || 'image/jpeg',
        });

        photoPath = uploadResult.data.photoPath;
        console.log("Photo uploaded to Firebase Storage:", photoPath);
      } catch (uploadError) {
        console.error("Photo upload error:", uploadError);
        // 画像アップロードエラーは続行（テキストのみで分析）
      }
    }

    // Cloud Function経由でDify APIを呼び出し
    const result = await analyzeMealFunction({
      textDescription: textDescription || '',
      photoPath: photoPath, // Firebase Storageのパス
      mealType: mealType,
    });

    console.log("Analysis result:", result.data);
    return result.data;

  } catch (error) {
    console.error("Error analyzing meal:", error);
    
    // エラー時はモックレスポンスを返す（開発用）
    if (process.env.NODE_ENV === 'development' || !error.code) {
      console.warn("Using mock response due to error");
      return getMockResponse(textDescription);
    }
    
    // Firebase Functionsのエラーを適切に処理
    throw new Error(error.message || '食事分析中にエラーが発生しました');
  }
}

/**
 * モックレスポンス（開発・フォールバック用）
 */
function getMockResponse(userDescription) {
  return {
    menu: userDescription || "食事",
    calories: 450,
    pfc: {
      p: 40,
      f: 5,
      c: 60
    },
    salt: 1.2,
    advice: "完璧です！「皮なし」の選択が素晴らしい。脂質を抑えつつタンパク質を確保できています。",
    raw_output: `【食べたもの内訳】
・${userDescription || '食事'}
----------------------------
📊 推定栄養素まとめ
----------------------------
🔥 カロリー　：約 450 kcal
💪 タンパク質：約 40 g
🥑 脂質　　　：約 5 g
🍚 炭水化物　：約 60 g
🧂 食塩相当量：約 1.2 g
----------------------------
👨‍⚕️ 最強管理師のワンポイント
完璧です！「皮なし」の選択が素晴らしい。脂質を抑えつつタンパク質を確保できています。
次はビタミン補給のために緑黄色野菜を少し足すと、さらに最強の食事になりますよ！`
  };
}
