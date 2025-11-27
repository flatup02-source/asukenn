# Dify統合ガイド - ステップバイステップ

このガイドでは、現在のフロントエンドアプリを「アイカAPP」Difyアプリと統合する手順を説明します。

## 📋 統合の全体像

```
フロントエンド (Netlify)
    ↓
Dify API (アイカAPP)
    ↓
栄養分析結果
    ↓
フロントエンドに表示
```

## 🚀 ステップバイステップ手順

### ステップ1: Difyアプリの確認と設定

#### 1-1. Difyアプリの確認
1. [Dify](https://dify.ai)にログイン
2. 「アイカAPP」アプリを開く
3. アプリの設定を確認：
   - **アプリタイプ**: Chat App / Agent App / Workflow App
   - **入力変数**: 写真とテキストを受け取る設定になっているか
   - **出力形式**: JSON形式で返す設定になっているか

#### 1-2. APIエンドポイントの確認
1. Difyアプリの「API」タブを開く
2. 以下の情報をメモ：
   - **API Endpoint URL**: `https://api.dify.ai/v1/chat-messages` または類似
   - **API Key**: アプリのAPIキー

#### 1-3. アプリのプロンプト確認
- アプリが「最強の栄養管理師」のペルソナで動作しているか確認
- 出力フォーマットが指定された形式（JSON）になっているか確認

---

### ステップ2: 環境変数の設定

#### 2-1. Netlify環境変数の設定
1. Netlifyダッシュボードにログイン
2. サイトを選択 → 「Site settings」→「Environment variables」
3. 以下の環境変数を追加：
   ```
   DIFY_API_KEY = your_dify_api_key_here
   DIFY_ENDPOINT = https://api.dify.ai/v1/chat-messages
   DIFY_APP_ID = your_app_id_here (必要に応じて)
   ```

#### 2-2. ローカル開発用の設定
`.env.local`ファイルを作成（Gitにコミットしない）：
```env
DIFY_API_KEY=your_dify_api_key_here
DIFY_ENDPOINT=https://api.dify.ai/v1/chat-messages
```

---

### ステップ3: Netlify Functionsの作成（推奨）

フロントエンドから直接Dify APIを呼ぶと、APIキーが漏洩する可能性があるため、Netlify Functionsを経由します。

#### 3-1. Functionsディレクトリの作成
```bash
cd "/Users/jin/Library/CloudStorage/Dropbox/NEW WORLD/1120/asken_clone"
mkdir -p netlify/functions
```

#### 3-2. Dify API呼び出し関数の作成
`netlify/functions/analyze-meal.js` を作成（次のステップで実装）

---

### ステップ4: コード実装

#### 4-1. Netlify Functionの実装
`netlify/functions/analyze-meal.js` にDify API呼び出しロジックを実装

#### 4-2. フロントエンドの更新
`scripts/dify.js` を更新して、Netlify Functionを呼び出すように変更

#### 4-3. レスポンス処理の実装
Difyからのレスポンスをパースして、アプリで使用する形式に変換

---

### ステップ5: テストとデバッグ

#### 5-1. ローカルテスト
- Netlify CLIでローカルサーバーを起動
- 実際のAPI呼び出しをテスト

#### 5-2. エラーハンドリング
- ネットワークエラー
- APIエラー
- レスポンス形式エラー

---

### ステップ6: デプロイと確認

#### 6-1. コードをコミット・プッシュ
```bash
git add .
git commit -m "Dify API統合を実装"
git push
```

#### 6-2. Netlifyでの動作確認
- デプロイが成功したか確認
- 実際に食事記録をテスト
- エラーログを確認

---

## 📝 実装の詳細

### Dify APIの呼び出し形式

Dify APIは通常、以下の形式で呼び出します：

```javascript
POST https://api.dify.ai/v1/chat-messages
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json
Body:
{
  "inputs": {
    "text": "食事の説明",
    "photo": "base64エンコードされた画像" // またはURL
  },
  "query": "食事の説明",
  "response_mode": "blocking",
  "conversation_id": "",
  "user": "user-123"
}
```

### レスポンス形式

Difyからのレスポンスを、アプリで使用する形式に変換：

```javascript
{
  menu: "メニュー名",
  calories: 450,
  pfc: {
    p: 40,
    f: 5,
    c: 60
  },
  salt: 1.2,
  advice: "アドバイス",
  raw_output: "Difyからの生の出力"
}
```

---

## 🔧 必要な設定ファイル

1. `netlify/functions/analyze-meal.js` - Netlify Function
2. `scripts/dify.js` - 更新（Netlify Functionを呼び出す）
3. `.env.example` - 環境変数のテンプレート
4. `netlify.toml` - Functions設定の追加

---

## ⚠️ 注意事項

1. **APIキーの管理**: フロントエンドに直接APIキーを書かない
2. **CORS設定**: Dify APIのCORS設定を確認
3. **レート制限**: Dify APIのレート制限に注意
4. **エラーハンドリング**: 適切なエラーメッセージを表示
5. **レスポンス形式**: Difyアプリの出力形式を確認

---

## 📚 参考リンク

- [Dify API Documentation](https://docs.dify.ai/guides/application-development/api)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)

---

次のステップに進みますか？実装を開始しますか？

