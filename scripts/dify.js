// Dify API Service (Mock for now)

const DIFY_API_KEY = "YOUR_DIFY_API_KEY"; // Placeholder
const DIFY_ENDPOINT = "YOUR_DIFY_ENDPOINT"; // Placeholder

/**
 * Analyzes meal using Dify API (or Mock)
 * @param {File} photoFile - The image file (optional)
 * @param {string} textDescription - The text description
 * @returns {Promise<Object>} - Structured analysis result
 */
export async function analyzeMeal(photoFile, textDescription) {
  console.log("Analyzing meal...", { photoFile, textDescription });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock Response based on "Strongest Nutritionist" Persona
  const mockResponse = {
    menu: "Chicken Breast & Rice (User Description)",
    calories: 450,
    pfc: {
      p: 40,
      f: 5,
      c: 60
    },
    salt: 1.2,
    advice: "Excellent choice! High protein and low fat. This is perfect for muscle building. Consider adding some broccoli for fiber next time!",
    raw_output: `【食べたもの内訳】
・鶏胸肉 (皮なし) ：150g
・白米　　　　　：200g
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

  // TODO: Implement actual fetch call to Dify when keys are available
  /*
  const formData = new FormData();
  formData.append('inputs', JSON.stringify({ text: textDescription }));
  if (photoFile) formData.append('file', photoFile);
  
  const response = await fetch(DIFY_ENDPOINT, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${DIFY_API_KEY}` },
    body: formData
  });
  return await response.json();
  */

  return mockResponse;
}
