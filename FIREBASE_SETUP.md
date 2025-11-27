# Firebase & Google Cloud Functions セットアップガイド

このアプリは、Google Cloud FunctionsとFirebase Storageを経由してDify APIを呼び出すアーキテクチャになっています。

## 📋 アーキテクチャ

```
フロントエンド (Netlify)
    ↓
Firebase Storage (画像保存)
    ↓
Google Cloud Functions
    ↓
Dify API (アイカAPP)
    ↓
分析結果を返す
```

## 🚀 セットアップ手順

### ステップ1: Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にログイン
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `asken-clone`）
4. Google Analyticsの設定（オプション）
5. プロジェクトを作成

### ステップ2: Firebase 設定の取得

1. Firebase Consoleでプロジェクトを開く
2. ⚙️（設定）→「プロジェクトの設定」をクリック
3. 「マイアプリ」セクションで「</>」（ウェブ）をクリック
4. アプリ名を入力して登録
5. 表示された設定をコピー

### ステップ3: フロントエンドのFirebase設定

1. `scripts/firebase.js` を開く
2. 以下の値を実際の値に置き換え：

```javascript
const firebaseConfig = {
    apiKey: "実際のAPI_KEY",
    authDomain: "実際のPROJECT_ID.firebaseapp.com",
    projectId: "実際のPROJECT_ID",
    storageBucket: "実際のPROJECT_ID.appspot.com",
    messagingSenderId: "実際のMESSAGING_SENDER_ID",
    appId: "実際のAPP_ID"
};
```

### ステップ4: Firebase Storage の有効化

1. Firebase Consoleで「Storage」を開く
2. 「始める」をクリック
3. セキュリティルールを確認（`storage.rules`ファイルの内容）
4. ロケーションを選択（例: `asia-northeast1`）
5. 「完了」をクリック

### ステップ5: Firestore の有効化（オプション）

1. Firebase Consoleで「Firestore Database」を開く
2. 「データベースを作成」をクリック
3. セキュリティルールを確認（`firestore.rules`ファイルの内容）
4. ロケーションを選択（Storageと同じロケーションを推奨）
5. 「有効にする」をクリック

### ステップ6: Google Cloud Functions のデプロイ

1. Firebase CLIをインストール（未インストールの場合）：
```bash
npm install -g firebase-tools
```

2. Firebaseにログイン：
```bash
firebase login
```

3. プロジェクトを設定：
```bash
cd "/Users/jin/Library/CloudStorage/Dropbox/NEW WORLD/1120/asken_clone"
firebase use --add
# プロジェクトIDを選択
```

4. `.firebaserc`ファイルを編集して、実際のプロジェクトIDを設定：
```json
{
  "projects": {
    "default": "実際のPROJECT_ID"
  }
}
```

5. Functionsの依存関係をインストール：
```bash
cd functions
npm install
cd ..
```

6. Dify API設定を追加：
```bash
firebase functions:config:set dify.api_key="YOUR_DIFY_API_KEY"
firebase functions:config:set dify.endpoint="https://api.dify.ai/v1/chat-messages"
```

7. Functionsをデプロイ：
```bash
firebase deploy --only functions
```

### ステップ7: 動作確認

1. フロントエンドアプリにアクセス
2. 「食事記録」ページで以下をテスト：
   - 食事タイプを選択
   - 写真をアップロード
   - 食事の内容を入力
   - 「AIで分析する」をクリック
3. Firebase Consoleで以下を確認：
   - Storageに画像がアップロードされているか
   - Functionsのログにエラーがないか
   - Firestoreに記録が保存されているか（オプション）

## 📝 設定ファイルの説明

### `functions/index.js`
- `analyzeMeal`: 食事分析用のCloud Function
- `uploadMealPhoto`: 画像アップロード用のCloud Function

### `functions/package.json`
- Cloud Functionsの依存関係

### `firebase.json`
- Firebaseプロジェクトの設定

### `storage.rules`
- Firebase Storageのセキュリティルール

### `firestore.rules`
- Firestoreのセキュリティルール

## ⚠️ 注意事項

1. **セキュリティ**: 本番環境では、`storage.rules`と`firestore.rules`に認証を追加してください
2. **コスト**: Firebase StorageとCloud Functionsの使用量に応じて課金されます
3. **リージョン**: 日本からアクセスする場合は、`asia-northeast1`（東京）を選択することを推奨

## 🔧 トラブルシューティング

### Functionsがデプロイできない
- Node.jsのバージョンが18以上であることを確認
- `functions/package.json`の依存関係が正しいか確認

### 画像がアップロードできない
- Firebase Storageが有効になっているか確認
- `storage.rules`の設定を確認

### Dify APIが呼び出せない
- `firebase functions:config:get`で設定を確認
- Functionsのログを確認：`firebase functions:log`

## 📚 参考リンク

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)

