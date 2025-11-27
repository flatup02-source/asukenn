// Netlify Function: Dify API呼び出し
// この関数はフロントエンドから呼び出され、Dify APIにリクエストを送信します

exports.handler = async (event, context) => {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // OPTIONSリクエストの処理（CORS preflight）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // POSTリクエストのみ処理
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // 環境変数からDify設定を取得
    const DIFY_API_KEY = process.env.DIFY_API_KEY;
    const DIFY_ENDPOINT = process.env.DIFY_ENDPOINT || 'https://api.dify.ai/v1/chat-messages';

    if (!DIFY_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Dify API key not configured' }),
      };
    }

    // リクエストボディをパース
    const { textDescription, photoBase64, mealType } = JSON.parse(event.body);

    // Dify APIへのリクエストを構築
    const difyPayload = {
      inputs: {
        text: textDescription || '',
        meal_type: mealType || '',
      },
      query: textDescription || '食事を分析してください',
      response_mode: 'blocking',
      conversation_id: '',
      user: 'web-user',
    };

    // 画像がある場合は追加
    if (photoBase64) {
      difyPayload.inputs.photo = photoBase64;
    }

    // Dify APIを呼び出し
    const difyResponse = await fetch(DIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(difyPayload),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error('Dify API Error:', errorText);
      return {
        statusCode: difyResponse.status,
        headers,
        body: JSON.stringify({ 
          error: 'Dify API error',
          details: errorText 
        }),
      };
    }

    const difyData = await difyResponse.json();

    // Difyのレスポンスをアプリで使用する形式に変換
    const result = parseDifyResponse(difyData, textDescription);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};

/**
 * Difyのレスポンスをアプリで使用する形式に変換
 */
function parseDifyResponse(difyData, userDescription) {
  // Difyのレスポンス形式に応じて調整が必要
  // 一般的な形式: difyData.answer または difyData.message
  
  const rawOutput = difyData.answer || difyData.message || '';
  
  // JSON形式で返されている場合
  let parsedData;
  try {
    // レスポンスからJSONを抽出（```json ... ``` の形式の場合）
    const jsonMatch = rawOutput.match(/```json\s*([\s\S]*?)\s*```/) || 
                     rawOutput.match(/```\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // JSONが直接含まれている場合
      parsedData = JSON.parse(rawOutput);
    }
  } catch (e) {
    // JSON形式でない場合は、テキストから情報を抽出
    parsedData = extractNutritionInfo(rawOutput);
  }

  // デフォルト値とマージ
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
  // 正規表現で栄養情報を抽出
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

