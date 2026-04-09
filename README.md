# FLATUP AI OS

**自分専用のAI OS** - ジム運営・マーケティング・集客を自動化するシステム

## 📊 FLATUP AI とは

JINさん専用のAIエージェント。以下を支援・自動実行します：

- 📱 **LINE対応** - 体験案内・料金案内・クラス案内
- 📢 **マーケティング** - 広告案・SNS投稿・PR文章
- 🏆 **大会運営** - 大会PR・スポンサー提案・トレーラー案
- 📊 **集客分析** - 来客データ分析・広告コピー生成

---

## 🏗️ システム構成

### 3層AI構造

```
┌─────────────────────────────────────┐
│      MASTER BRAIN（思考層）          │
│  • 戦略・思考・意思決定              │
│  保存先: Obsidian                   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│     KNOWLEDGE BRAIN（知識層）        │
│  • ジム情報・料金・クラス・大会情報  │
│  保存先: Dify Knowledge / Qdrant    │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      ACTION BRAIN（実行層）          │
│  • LINE返信・SNS投稿・マーケティング │
│  実行先: Dify / n8n Workflow        │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│       外部連携                       │
│  • LINE BOT / Twitter / Instagram   │
└─────────────────────────────────────┘
```

---

## 🔄 データ同期フロー

```
Mac (開発環境)
  └─ Obsidian (知識管理)
       ↓ (Git Auto Commit)
  └─ GitHub
       ↓ (git fetch/pull)
VPS (本番環境)
  └─ Dify + Qdrant
       ↓ (RAG)
  └─ AI Agent
       ↓ (Line API)
  └─ LINE BOT
```

---

## 🛠️ 技術スタック

| 層 | ツール | 役割 |
|---|---|---|
| **知識管理** | Obsidian | JINさんの思考・ノウハウ保存 |
| **AI構築** | Dify | LINEボット・RAG・ワークフロー |
| **ベクトルDB** | Qdrant | 知識検索・埋め込み |
| **LLM** | Ollama / Mistral 7B | ローカル実行 |
| **自動化** | n8n | ワークフロー・スケジューリング |
| **同期** | GitHub + Git | 知識版管理・自動デプロイ |
| **ホスティング** | Xserver VPS | 本番環境 |

---

## 📋 セットアップ

### 前提環境
- **Mac**: M2 / 8GB RAM
- **VPS**: Xserver VPS
- **ブラウザ**: 最新版

### セットアップ手順

1. **[Mac環境セットアップ](./docs/SETUP_MAC.md)** - Obsidian + Ollama + Dify ローカル設定
2. **[VPS環境セットアップ](./docs/SETUP_VPS.md)** - Dify + Qdrant + n8n 本番環境
3. **[GitHub連携](./docs/SETUP_GITHUB.md)** - 自動同期設定
4. **[LINE連携](./docs/SETUP_LINE.md)** - LINE BOT セットアップ

詳細は各ドキュメントを参照してください。

---

## 📁 ディレクトリ構成

```
flatup-ai-os/
├── README.md                    # このファイル
├── ARCHITECTURE.md              # システムアーキテクチャ詳細
├── .env.example                 # 環境変数テンプレート
├── docs/
│   ├── SETUP_MAC.md            # Mac環境構築ガイド
│   ├── SETUP_VPS.md            # VPS環境構築ガイド
│   ├── SETUP_GITHUB.md         # GitHub連携ガイド
│   ├── SETUP_LINE.md           # LINE連携ガイド
│   ├── BRAIN_MASTER.md         # MASTER BRAIN 仕様
│   ├── BRAIN_KNOWLEDGE.md      # KNOWLEDGE BRAIN 仕様
│   └── BRAIN_ACTION.md         # ACTION BRAIN 仕様
├── config/
│   ├── dify-workflow.yml       # Dify ワークフロー設定
│   ├── n8n-workflow.json       # n8n ワークフロー定義
│   ├── qdrant-config.yml       # Qdrant 設定
│   └── obsidian-sync.sh        # Git自動同期スクリプト
├── scripts/
│   ├── setup-mac.sh            # Mac初期セットアップ
│   ├── setup-vps.sh            # VPS初期セットアップ
│   ├── sync-knowledge.py       # Obsidian→Qdrant 同期
│   └── health-check.sh         # ヘルスチェック
└── obsidian/
    ├── SOUL.md                 # AIKAの人格・性格
    ├── FLATUP_PHILOSOPHY.md    # ジムの理念・思想
    ├── MARKETING_STRATEGY.md   # マーケティング戦略
    ├── GYM_INFO.md            # ジム情報・料金・クラス
    ├── EVENT_PLANNING.md      # 大会企画・実績
    └── DAILY_NOTES.md         # 日々のノート
```

---

## 🚀 クイックスタート

### 1. 環境変数を設定

```bash
cp .env.example .env
# .env を編集してください
```

### 2. Mac で Dify をローカル起動（開発用）

```bash
cd config/
docker-compose up -d  # Dify のコンテナ起動
```

### 3. Obsidian で知識を入力

`obsidian/SOUL.md` にAIKAの性格を書き込む

### 4. VPS にデプロイ

```bash
git push origin main
# VPS側で自動同期される
```

---

## 📚 ドキュメント

| ドキュメント | 内容 |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | システムアーキテクチャ詳細 |
| [docs/SETUP_MAC.md](./docs/SETUP_MAC.md) | Mac環境セットアップ |
| [docs/SETUP_VPS.md](./docs/SETUP_VPS.md) | VPS環境セットアップ |
| [docs/BRAIN_MASTER.md](./docs/BRAIN_MASTER.md) | MASTER BRAIN 仕様 |
| [docs/BRAIN_KNOWLEDGE.md](./docs/BRAIN_KNOWLEDGE.md) | KNOWLEDGE BRAIN 仕様 |
| [docs/BRAIN_ACTION.md](./docs/BRAIN_ACTION.md) | ACTION BRAIN 仕様 |

---

## ⚙️ 主要コマンド

```bash
# 開発環境起動
npm run dev

# VPS に同期
git push origin main

# ローカルテスト
npm run test

# ヘルスチェック
./scripts/health-check.sh
```

---

## 🎯 ロードマップ

- [x] アーキテクチャ設計
- [ ] Mac環境セットアップ
- [ ] VPS環境セットアップ
- [ ] Dify ワークフロー構築
- [ ] LINE BOT 連携
- [ ] Obsidian 自動同期
- [ ] n8n 自動化ワークフロー
- [ ] マーケティングAI実装
- [ ] 運用開始

---

## 📞 サポート

質問や問題がある場合は、各ドキュメントを参照するか、Issue を作成してください。

---

**Made with ❤️ for FLATUP GYM**
