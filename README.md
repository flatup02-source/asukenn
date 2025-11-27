# Strongest Nutritionist AI

最強の栄養管理師AIアプリ - 食事記録と栄養分析アプリケーション

## デプロイ方法（Netlify）

### 方法1: Netlify CLIを使用

1. Netlify CLIをインストール（未インストールの場合）
```bash
npm install -g netlify-cli
```

2. Netlifyにログイン
```bash
netlify login
```

3. プロジェクトディレクトリでデプロイ
```bash
cd asken_clone
netlify deploy --prod
```

### 方法2: Netlify Web UIを使用（推奨）

1. [Netlify](https://app.netlify.com)にログイン
2. "Add new site" → "Deploy manually" を選択
3. **`asken_clone` フォルダの中身**をドラッグ&ドロップ
   - ⚠️ 注意: `asken_clone`フォルダ自体ではなく、**フォルダの中身**（index.html、styles、scriptsなど）をドラッグ&ドロップしてください
4. デプロイ完了！

**404エラーが出る場合の対処法：**
- Netlifyのサイト設定で「Publish directory」が `.` になっているか確認
- または、`asken_clone`フォルダ全体をデプロイした場合は、Netlifyの設定で「Base directory」を `asken_clone` に設定

### 方法3: Git連携（推奨）

1. GitHub/GitLab/Bitbucketにリポジトリをプッシュ
2. Netlifyで "Import from Git" を選択
3. リポジトリを選択
4. ビルド設定：
   - **Base directory**: `asken_clone`（またはルートに配置している場合は空白）
   - **Publish directory**: `asken_clone`（または `.`）
   - **Build command**: （空白 - 静的サイトなので不要）
5. "Deploy site" をクリック

## ファイル構造

```
asken_clone/
├── index.html          # ダッシュボード
├── log.html            # 食事記録ページ
├── scripts/
│   ├── main.js         # ダッシュボードロジック
│   ├── log.js          # 食事記録ロジック
│   ├── dify.js         # Dify API連携（モック）
│   └── firebase.js      # Firebase設定（プレースホルダー）
├── styles/
│   ├── index.css       # レイアウトスタイル
│   └── theme.css       # テーマスタイル
├── data/
│   └── foods.json      # 食品データ
└── netlify.toml        # Netlify設定
```

## 機能

- 📊 日次PFCバランス表示
- 🍽 食事記録
- 🤖 AI栄養分析（Dify API連携予定）
- 📱 レスポンシブデザイン

## 開発

ローカルで確認する場合：

```bash
# 簡単なHTTPサーバーを起動
python3 -m http.server 8000
# または
npx serve asken_clone
```

ブラウザで `http://localhost:8000` を開く

