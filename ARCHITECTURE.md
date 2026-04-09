# FLATUP AI OS - システムアーキテクチャ詳細

## 📐 システム全体図

```
┌─────────────────────────────────────────────────────────────┐
│                    FLATUP AI OS                             │
│                   (3層 AI 構造)                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   MAC (開発環境)                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  MASTER BRAIN                                         │ │
│  │  ├─ Obsidian (知識管理)                               │ │
│  │  │  ├─ SOUL.md (AIKAの人格)                           │ │
│  │  │  ├─ FLATUP_PHILOSOPHY.md (ジムの理念)              │ │
│  │  │  ├─ MARKETING_STRATEGY.md (マーケティング)          │ │
│  │  │  ├─ GYM_INFO.md (ジム情報)                         │ │
│  │  │  └─ EVENT_PLANNING.md (大会企画)                   │ │
│  │  └─ Git Auto Sync (自動コミット)                      │ │
│  └───────────────────────────────────────────────────────┘ │
│           ↓ (git push / auto commit)                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  開発用 Dify (ローカル)                                 │ │
│  │  ├─ Workflow テスト                                    │ │
│  │  └─ LLM テスト (Ollama)                                │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
           ↓ (GitHub via Git)
┌─────────────────────────────────────────────────────────────┐
│                GitHub (中央管理)                            │
│  ├─ リポジトリ: flatup02-source/asukenn                    │
│  ├─ ブランチ: main / develop                               │
│  └─ 自動デプロイ: push → VPS webhook                      │
└─────────────────────────────────────────────────────────────┘
           ↓ (git pull / webhook trigger)
┌─────────────────────────────────────────────────────────────┐
│              VPS (本番環境 / Xserver)                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  KNOWLEDGE BRAIN                                      │ │
│  │  ├─ Qdrant (ベクトル DB)                              │ │
│  │  │  └─ Obsidian 知識の埋め込み                        │ │
│  │  └─ RAG Search                                        │ │
│  └───────────────────────────────────────────────────────┘ │
│           ↓                                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  ACTION BRAIN                                         │ │
│  │  ├─ Dify (本番環境)                                   │ │
│  │  │  ├─ Workflow: LINE応答                             │ │
│  │  │  ├─ Workflow: SNS投稿生成                          │ │
│  │  │  ├─ Workflow: マーケティング提案                   │ │
│  │  │  └─ RAG: Qdrant との連携                           │ │
│  │  └─ Ollama / Mistral 7B (LLM)                         │ │
│  └───────────────────────────────────────────────────────┘ │
│           ↓ (API Call)                                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  n8n (ワークフロー・スケジューリング)                    │ │
│  │  ├─ LINE メッセージ受信 → Dify → 返信                 │ │
│  │  ├─ 定時投稿 (SNS / LINE)                             │ │
│  │  ├─ 来客分析 → マーケティング提案生成                  │ │
│  │  └─ Obsidian 更新検知 → 自動同期                      │ │
│  └───────────────────────────────────────────────────────┘ │
│           ↓ (API Call)                                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  外部連携 API                                         │ │
│  │  ├─ LINE Messaging API                               │ │
│  │  ├─ Twitter API                                      │ │
│  │  ├─ Instagram API                                    │ │
│  │  └─ Google Analytics API                             │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
           ↓ (API Response)
┌─────────────────────────────────────────────────────────────┐
│              外部サービス                                   │
│  ├─ LINE (メッセージング)                                  │
│  ├─ Twitter / Instagram (SNS)                             │
│  └─ Google Analytics (分析)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 3層 AI 構造の詳細

### Layer 1: MASTER BRAIN（思考層）

**役割**：戦略・思考・意思決定  
**保存先**：Obsidian (Mac)  
**更新頻度**：手動 + 自動同期

```
SOUL.md
├─ AIKAの人格
│  ├─ 性格: クール、理知的
│  ├─ トーン: 女性に優しい
│  ├─ NG: 不潔な男性
│  └─ 専門分野: ジム・マーケティング
├─ 思考パターン
└─ 判断基準

FLATUP_PHILOSOPHY.md
├─ ジムの理念
├─ ターゲット層
├─ ブランドイメージ
└─ ジムの強み

MARKETING_STRATEGY.md
├─ ターゲット分析
├─ 広告戦略
├─ SNS戦略
└─ キャンペーンアイデア

GYM_INFO.md
├─ 基本情報
├─ 料金表
├─ クラス情報
└─ スタッフ情報

EVENT_PLANNING.md
├─ 大会情報
├─ イベント企画
├─ PR案
└─ スポンサー情報
```

**更新フロー**：
```
JINさんが Obsidian で思考を記入
    ↓ (自動コミット)
Git に記録
    ↓ (git push)
GitHub に反映
    ↓ (webhook trigger)
VPS に自動同期
    ↓ (ベクトル化)
Qdrant に保存
    ↓ (RAG)
Dify が学習・参照
```

---

### Layer 2: KNOWLEDGE BRAIN（知識層）

**役割**：事実・データ・参照情報の提供  
**保存先**：Qdrant (VPS) + Dify Knowledge  
**更新頻度**：自動（Obsidian 連動）

```
知識ベース構成：
├─ Gym Data
│  ├─ 料金プラン
│  ├─ クラス情報
│  ├─ スタッフ紹介
│  └─ 営業時間
├─ Marketing Data
│  ├─ キャンペーン履歴
│  ├─ 顧客セグメント
│  └─ 成功事例
├─ Event Data
│  ├─ 過去大会情報
│  ├─ 参加者データ
│  └─ スポンサー情報
└─ Daily Data
   ├─ 本日の来客数
   ├─ 問い合わせ内容
   └─ SNS反応数
```

**検索メカニズム**：
```
ユーザー質問
    ↓
Dify が Qdrant に RAG クエリ
    ↓
ベクトル類似度検索
    ↓
関連知識をピックアップ
    ↓
MASTER BRAIN の思想と合成
    ↓
回答生成
```

---

### Layer 3: ACTION BRAIN（実行層）

**役割**：LINE返信・SNS投稿・マーケティング提案生成  
**実行先**：Dify + n8n  
**応答時間**：リアルタイム〜非同期

#### 3-1: LINE対応

```
ユーザーが LINE でメッセージ送信
    ↓
LINE Messaging API → n8n webhook
    ↓
n8n が Dify に転送
    ↓
Dify Workflow:
├─ 質問内容を分類
├─ Qdrant で関連知識検索
├─ MASTER BRAIN の思想を参照
├─ LLM で回答生成
└─ 自然言語処理
    ↓
LINE BOT が返信
```

**LINE での対応内容**：
- 体験案内（600文字テンプレート）
- 料金案内（プラン別説明）
- クラス案内（時間・内容・難度）
- 大会情報（日程・参加条件）
- 一般質問（FAQ学習）

#### 3-2: SNS投稿生成

```
n8n スケジュール実行
    ↓
Dify Workflow:
├─ 本日のテーマを決定
├─ Obsidian から Marketing Strategy を読込
├─ Qdrant から関連データを検索
├─ LLM で複数パターン生成
├─ 画像案も提案
└─ JSON で返却
    ↓
n8n が投稿内容をフォーマット
    ↓
SNS API 経由で投稿
```

**自動投稿内容**：
- 日々のトレーニングTips
- 大会紹介・PR
- メンバー紹介
- キャンペーン告知
- 季節情報

#### 3-3: マーケティング提案生成

```
n8n 定期実行（日1回）
    ↓
Dify Workflow:
├─ Google Analytics から来客数データ取得
├─ LINE 問い合わせ内容を分析
├─ Twitter リーチ数を取得
├─ マーケティング戦略を参照
├─ 「明日打つべき広告コピー」を3つ生成
└─ 施策案も提示
    ↓
JINさん宛に LINE で提案送信
```

---

## 🔄 データ同期フロー（詳細）

### フロー1：Obsidian → VPS

```
Step 1: Mac側
  Obsidian ファイル編集
  ↓
  Git Hook が自動検知
  ↓
  git add & git commit
  ↓
  git push origin main
  ↓ (GitHub)

Step 2: GitHub
  Webhook トリガー
  ↓
  VPS に通知

Step 3: VPS側
  git pull origin main
  ↓
  Python スクリプト実行
  ↓
  Obsidian ファイルを読込
  ↓
  テキストを埋め込み化（Embedding）
  ↓
  Qdrant に保存
  ↓
  Dify が自動的に参照可能に
```

### フロー2：LINE メッセージ → 自動応答

```
ユーザー: LINE で「体験したいんですけど」
  ↓
LINE Messaging API
  ↓
Webhook → VPS の n8n
  ↓
n8n が Dify に転送
  ↓
Dify Workflow:
  1. 質問内容の分析（BERT など）
  2. Qdrant で「体験・料金」関連記事検索
  3. LLM に SOUL.md の性格を注入
  4. 回答テンプレート生成
  5. LINE API で返信
  ↓
ユーザー: 体験案内を受け取り
```

---

## 🛠️ コンポーネント仕様

### 1. Ollama（LLM エンジン）

**モデル**：Mistral 7B 量子化版  
**メモリ**：5-6GB  
**推論速度**：M2 で約100文字/秒  

```bash
# インストール
brew install ollama

# モデル取得
ollama pull mistral

# ポート: 11434
# API: http://localhost:11434/api/generate
```

### 2. Qdrant（ベクトルDB）

**用途**：知識の埋め込み保存・検索  
**API**：REST / gRPC  
**ポート**：6333  

```bash
# Docker で起動
docker run -p 6333:6333 qdrant/qdrant

# Collection 作成例
POST /collections
{
  "name": "flatup_brain",
  "vectors": {
    "size": 384,
    "distance": "Cosine"
  }
}
```

### 3. Dify（AI アプリ構築）

**用途**：ワークフロー・RAG・LINE連携  
**エディション**：Self-Hosted  

```bash
# Docker Compose で起動
docker-compose up -d

# 主要ワークフロー
├─ LINE_RESPONDER (LINE返信)
├─ SNS_GENERATOR (SNS投稿生成)
└─ MARKETING_AI (マーケティング提案)
```

### 4. n8n（オートメーション）

**用途**：ワークフロー実行・スケジューリング  
**ポート**：5678  

```bash
# Docker で起動
docker run -it -p 5678:5678 n8nio/n8n

# ワークフロー例
├─ LINE Webhook 受信 → Dify 転送
├─ 日次 SNS 投稿スケジュール
└─ Obsidian 更新検知 → 自動同期
```

---

## 📊 パフォーマンス指標

| メトリクス | 目標値 | 現在値 |
|---|---|---|
| LINE 返信時間 | < 2秒 | - |
| SNS 投稿生成時間 | < 30秒 | - |
| Obsidian 同期時間 | < 5分 | - |
| Qdrant 検索時間 | < 500ms | - |
| システム稼働率 | 99.5% | - |

---

## 🔐 セキュリティ

- Dify・n8n は VPS 内部ネットワークのみアクセス
- LINE API キーは環境変数で管理
- GitHub は SSH 認証
- Qdrant API キー設定必須
- ログは `/var/log/flatup-ai/` に保存

---

## 🚀 スケーリング計画

**Phase 1（現在）**：
- シングル VPS 構成
- Ollama ローカル実行

**Phase 2（将来）**：
- 複数 VPS（分散）
- 外部 LLM API（Claude など）

**Phase 3（最終）**：
- Kubernetes 構成
- マルチリージョン展開

---

## 📞 トラブルシューティング

### Qdrant が起動しない
```bash
docker ps | grep qdrant
docker logs qdrant_container
```

### Dify が LINE に返信しない
1. Webhook URL が正しいか確認
2. n8n ログをチェック
3. LINE API キー有効期限を確認

### Obsidian 同期が遅い
1. GitHub の webhook ログを確認
2. VPS の git pull スクリプトを実行
3. Qdrant の埋め込み状態をチェック

---

**Last Updated**: 2026-04-09
