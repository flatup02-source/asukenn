// Dify API Service
// Netlify Function経由でDify APIを呼び出します

const NETLIFY_FUNCTION_URL = '/.netlify/functions/analyze-meal';

/**
 * 画像ファイルをBase64に変換
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // data:image/jpeg;base64, の部分を除去
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyzes meal using Dify API via Netlify Function
 * @param {File} photoFile - The image file (optional)
 * @param {string} textDescription - The text description
 * @param {string} mealType - The meal type (breakfast, lunch, dinner, snack)
 * @returns {Promise<Object>} - Structured analysis result
 */
export async function analyzeMeal(photoFile, textDescription, mealType = '') {
  console.log("Analyzing meal via Netlify Function...", { 
    photoFile, 
    textDescription, 
    mealType 
  });

  try {
    // 画像をBase64に変換（ある場合）
    let photoBase64 = null;
    if (photoFile) {
      photoBase64 = await fileToBase64(photoFile);
    }

    // Netlify Functionを呼び出し
    const response = await fetch(NETLIFY_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        textDescription: textDescription || '',
        photoBase64: photoBase64,
        mealType: mealType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // エラーレスポンスのチェック
    if (result.error) {
      throw new Error(result.error);
    }

    console.log("Analysis result:", result);
    return result;

  } catch (error) {
    console.error("Error analyzing meal:", error);
    
    // エラー時はモックレスポンスを返す（開発用）
    if (process.env.NODE_ENV === 'development') {
      console.warn("Using mock response due to error");
      return getMockResponse(textDescription);
    }
    
    throw error;
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
