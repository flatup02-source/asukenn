# 最強の栄養管理師AI - 要件指示書

## 📋 プロジェクト概要

**プロジェクト名**: 最強の栄養管理師AI（Asken Clone）  
**作成日**: 2024年11月  
**バージョン**: 1.0.0  
**完成度**: **7.5/10点**

---

## 🎯 プロジェクトの目的

食事記録と栄養分析を行うWebアプリケーション。ユーザーが食事の写真と説明を入力すると、AI（Dify）が栄養素を分析し、PFCバランス（タンパク質・脂質・炭水化物）を表示する。

---

## 🏗️ アーキテクチャ

### システム構成

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

### 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **ホスティング**: Netlify
- **バックエンド**: Google Cloud Functions
- **ストレージ**: Firebase Storage
- **データベース**: Firestore (オプション)
- **AI API**: Dify API
- **バージョン管理**: Git/GitHub

---

## ✨ 実装済み機能

### ✅ 完成している機能（7.5点の理由）

#### 1. フロントエンド（完成度: 9/10）
- ✅ ダッシュボード画面（PFCバランス表示）
- ✅ 食事記録画面（写真アップロード、テキスト入力）
- ✅ 食事タイプ分類（朝食、昼食、夕食、間食）
- ✅ 食事タイプ別フィルタリング
- ✅ レスポンシブデザイン
- ✅ 日本語UI完全対応
- ✅ モチベーションメッセージ表示
- ⚠️ 写真プレビュー機能（実装済みだが、Firebase統合待ち）

#### 2. バックエンド（完成度: 6/10）
- ✅ Google Cloud Functions実装済み
- ✅ Firebase Storage統合準備完了
- ✅ Dify API呼び出しロジック実装済み
- ⚠️ **未設定**: Firebase設定（実際の値が必要）
- ⚠️ **未デプロイ**: Cloud Functions（デプロイが必要）
- ⚠️ **未設定**: Dify API設定（環境変数設定が必要）

#### 3. データ管理（完成度: 5/10）
- ✅ LocalStorageで一時保存（動作確認済み）
- ✅ Firestore統合準備完了
- ⚠️ **未設定**: Firestore（有効化が必要）
- ⚠️ **未実装**: データ永続化（Firestoreへの保存は実装済みだが未テスト）

#### 4. AI統合（完成度: 7/10）
- ✅ Dify API呼び出しロジック実装済み
- ✅ レスポンスパース処理実装済み
- ✅ エラーハンドリング実装済み
- ⚠️ **未接続**: 実際のDifyアプリとの接続（設定が必要）
- ⚠️ **未テスト**: 実際のAPI呼び出し（モックのみ動作確認済み）

---

## 📝 完成度評価: 7.5/10点

### 評価内訳

| 項目 | 完成度 | 備考 |
|------|--------|------|
| フロントエンドUI/UX | 9/10 | ほぼ完成。写真アップロードの統合待ち |
| バックエンド実装 | 6/10 | コードは完成。設定・デプロイが必要 |
| データ管理 | 5/10 | LocalStorageは動作。Firestoreは未設定 |
| AI統合 | 7/10 | ロジック完成。実際の接続待ち |
| ドキュメント | 9/10 | 充実したドキュメントあり |
| デプロイ | 8/10 | Netlify自動デプロイ設定済み |
| **総合** | **7.5/10** | **基本機能は完成。設定・接続が必要** |

### 減点理由

1. **-1.0点**: Firebase設定が未完了（実際の値が必要）
2. **-0.5点**: Cloud Functionsが未デプロイ
3. **-0.5点**: Dify APIとの実際の接続が未テスト
4. **-0.5点**: Firestoreが未有効化

### 加点理由

1. **+0.5点**: 充実したドキュメント
2. **+0.5点**: エラーハンドリングの実装
3. **+0.5点**: レスポンシブデザインの完成度

---

## 🚧 未完成・要設定項目

### 必須設定（動作させるために必要）

1. **Firebase設定**
   - [ ] Firebase プロジェクト作成
   - [ ] `scripts/firebase.js` に実際の設定値を入力
   - [ ] Firebase Storage有効化
   - [ ] Firestore有効化（オプション）

2. **Google Cloud Functions**
   - [ ] Firebase CLIインストール
   - [ ] Functions依存関係インストール（`cd functions && npm install`）
   - [ ] Dify API設定追加（`firebase functions:config:set`）
   - [ ] Functionsデプロイ（`firebase deploy --only functions`）

3. **Dify API**
   - [ ] Difyアプリ（アイカAPP）のAPI Key取得
   - [ ] Difyアプリのエンドポイント確認
   - [ ] Difyアプリのプロンプト設定（`DIFY_PROMPT_TEMPLATE.txt`参照）

### 推奨設定

1. **セキュリティ**
   - [ ] `storage.rules` に認証を追加
   - [ ] `firestore.rules` に認証を追加
   - [ ] Cloud Functionsに認証チェックを追加

2. **最適化**
   - [ ] 画像のリサイズ処理
   - [ ] キャッシュ戦略の実装
   - [ ] エラーログの集約

---

## 📂 ファイル構成

```
asken_clone/
├── index.html                    # ダッシュボード
├── log.html                      # 食事記録ページ
├── scripts/
│   ├── main.js                   # ダッシュボードロジック
│   ├── log.js                    # 食事記録ロジック
│   ├── dify.js                   # Dify API呼び出し（Cloud Functions経由）
│   └── firebase.js               # Firebase設定・初期化
├── styles/
│   ├── index.css                 # レイアウトスタイル
│   └── theme.css                 # テーマスタイル
├── functions/
│   ├── index.js                  # Cloud Functions実装
│   └── package.json              # Functions依存関係
├── data/
│   └── foods.json                # 食品データ（参考用）
├── firebase.json                 # Firebase設定
├── .firebaserc                   # Firebaseプロジェクト設定
├── storage.rules                 # Storageセキュリティルール
├── firestore.rules               # Firestoreセキュリティルール
├── netlify.toml                  # Netlify設定
├── _redirects                    # Netlifyリダイレクト
├── README.md                     # プロジェクト説明
├── REQUIREMENTS.md               # このファイル（要件指示書）
├── FIREBASE_SETUP.md            # Firebaseセットアップガイド
├── DIFY_SETUP_SIMPLE.md         # Dify統合ガイド（簡潔版）
├── DIFY_INTEGRATION_INSTRUCTIONS.md  # Dify統合ガイド（詳細版）
└── DIFY_PROMPT_TEMPLATE.txt     # Difyプロンプトテンプレート
```

---

## 🔧 セットアップ手順（次の管理者向け）

### 1. リポジトリのクローン

```bash
git clone https://github.com/flatup02-source/asukenn.git
cd asukenn
```

### 2. Firebase設定

詳細は `FIREBASE_SETUP.md` を参照

1. Firebase プロジェクト作成
2. `scripts/firebase.js` に設定値を入力
3. Firebase Storage有効化
4. Firestore有効化（オプション）

### 3. Cloud Functionsデプロイ

```bash
# Firebase CLIインストール（未インストールの場合）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクト設定
firebase use --add

# Functions依存関係インストール
cd functions
npm install
cd ..

# Dify API設定
firebase functions:config:set dify.api_key="YOUR_DIFY_API_KEY"
firebase functions:config:set dify.endpoint="https://api.dify.ai/v1/chat-messages"

# Functionsデプロイ
firebase deploy --only functions
```

### 4. Difyアプリ設定

詳細は `DIFY_SETUP_SIMPLE.md` を参照

1. DifyアプリのAPI Key取得
2. Difyアプリのプロンプトを `DIFY_PROMPT_TEMPLATE.txt` の内容に設定

### 5. Netlifyデプロイ確認

- GitHubにプッシュすると自動デプロイされます
- 手動デプロイ: Netlifyダッシュボードから「Deploy site」

---

## 🐛 既知の問題・制限事項

1. **画像アップロード**: Firebase Storage設定が必要（現在はモック動作のみ）
2. **データ永続化**: LocalStorageのみ動作。Firestoreは未設定
3. **認証**: 未実装（全ユーザーがアクセス可能）
4. **エラーハンドリング**: 基本的な実装はあるが、詳細なエラーメッセージが必要
5. **テスト**: 実際のDify APIとの接続テストが未実施

---

## 📈 今後の改善案

### 短期（優先度高）

1. Firebase設定の完了
2. Cloud Functionsのデプロイ
3. Dify APIとの実際の接続テスト
4. エラーハンドリングの強化

### 中期

1. ユーザー認証機能の追加
2. データの永続化（Firestore）
3. 過去の食事記録の表示
4. グラフ・統計機能

### 長期

1. 複数ユーザー対応
2. 食事プランの提案
3. 目標設定機能
4. ソーシャル機能

---

## 📞 サポート・連絡先

- **リポジトリ**: https://github.com/flatup02-source/asukenn
- **Netlify URL**: https://sprightly-alfajores-7d494a.netlify.app
- **ドキュメント**: 各`.md`ファイルを参照

---

## ✅ チェックリスト（次の管理者用）

### 初期セットアップ

- [ ] リポジトリをクローン
- [ ] Firebase プロジェクト作成
- [ ] `scripts/firebase.js` に設定値を入力
- [ ] Firebase Storage有効化
- [ ] Firestore有効化（オプション）
- [ ] Cloud Functions依存関係インストール
- [ ] Dify API設定追加
- [ ] Cloud Functionsデプロイ
- [ ] Difyアプリ設定
- [ ] 動作確認

### 動作確認項目

- [ ] ダッシュボードが表示される
- [ ] 食事記録ページが表示される
- [ ] 食事タイプを選択できる
- [ ] 写真をアップロードできる
- [ ] 食事内容を入力できる
- [ ] AI分析が動作する（Dify API呼び出し）
- [ ] 分析結果が表示される
- [ ] 食事記録が保存される

---

**最終更新日**: 2024年11月27日  
**作成者**: AI Assistant  
**プロジェクト状態**: 開発中（基本機能完成、設定・接続待ち）
