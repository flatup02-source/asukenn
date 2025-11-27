# 最強の栄養管理師AI

食事記録と栄養分析アプリケーション

## 機能

- 📊 日次PFCバランス表示
- 🍽 食事記録（朝食、昼食、夕食、間食）
- 📷 写真アップロード機能
- 🤖 AI栄養分析（Dify API連携予定）
- 📱 レスポンシブデザイン

## デプロイ方法（Netlify）

### Git連携による自動デプロイ（推奨）

1. GitHub/GitLab/Bitbucketにリポジトリをプッシュ
2. [Netlify](https://app.netlify.com)にログイン
3. 「Add new site」→「Import from Git」を選択
4. リポジトリを選択
5. ビルド設定：
   - **Base directory**: （空白 - リポジトリのルートがasken_cloneの場合）
   - **Publish directory**: `.`
   - **Build command**: （空白 - 静的サイトなので不要）
6. 「Deploy site」をクリック

これで、Gitにプッシュするたびに自動的にNetlifyにデプロイされます！

### 手動デプロイ

1. [Netlify](https://app.netlify.com)にログイン
2. "Add new site" → "Deploy manually" を選択
3. **`asken_clone` フォルダの中身**をドラッグ&ドロップ

## ファイル構造

```
asken_clone/
├── index.html          # ダッシュボード
├── log.html           # 食事記録ページ
├── scripts/
│   ├── main.js        # ダッシュボードロジック
│   ├── log.js         # 食事記録ロジック
│   ├── dify.js        # Dify API連携（モック）
│   └── firebase.js    # Firebase設定（プレースホルダー）
├── styles/
│   ├── index.css      # レイアウトスタイル
│   └── theme.css      # テーマスタイル
├── data/
│   └── foods.json     # 食品データ
├── netlify.toml       # Netlify設定
├── _redirects         # Netlifyリダイレクト設定
└── README.md          # このファイル
```

## 開発

ローカルで確認する場合：

```bash
# 簡単なHTTPサーバーを起動
python3 -m http.server 8000
# または
npx serve asken_clone
```

ブラウザで `http://localhost:8000` を開く

## 技術スタック

- HTML5 / CSS3 / JavaScript (ES6+)
- LocalStorage（データ保存）
- Netlify（ホスティング）
