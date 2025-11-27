# Netlify自動デプロイ設定ガイド

## 1. GitHubにリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 「New repository」をクリック
3. リポジトリ名を入力（例: `strongest-nutritionist-ai`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

## 2. ローカルリポジトリをGitHubにプッシュ

```bash
cd "/Users/jin/Library/CloudStorage/Dropbox/NEW WORLD/1120/asken_clone"

# リモートリポジトリを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# ブランチ名をmainに変更（推奨）
git branch -M main

# プッシュ
git push -u origin main
```

## 3. NetlifyでGit連携を設定

1. [Netlify](https://app.netlify.com)にログイン
2. 「Add new site」→「Import from Git」をクリック
3. GitHubを選択して認証
4. 作成したリポジトリを選択
5. ビルド設定：
   - **Base directory**: （空白）
   - **Publish directory**: `.`
   - **Build command**: （空白）
6. 「Deploy site」をクリック

## 4. 今後の更新方法

コードを変更したら、以下のコマンドでプッシュ：

```bash
cd "/Users/jin/Library/CloudStorage/Dropbox/NEW WORLD/1120/asken_clone"

# 変更を確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "変更内容の説明"

# プッシュ（自動的にNetlifyにデプロイされる）
git push
```

Netlifyが自動的に変更を検知してデプロイします！

