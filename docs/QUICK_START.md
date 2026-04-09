# FLATUP AI OS クイックスタートガイド

**5分で FLATUP AI OS を動かすための最小限の手順**

---

## ステップ1：環境変数を設定（1分）

```bash
cd /home/user/asukenn
cp .env.example .env
```

以下を `.env` に記入：

```env
# Obsidian のパス
OBSIDIAN_PATH=/Users/jin/Documents/Obsidian\ Vault/FLATUP_BRAIN

# GitHub 設定
GITHUB_REPO=flatup02-source/asukenn
GITHUB_TOKEN=your_github_token_here

# LINE BOT 設定
LINE_CHANNEL_ID=your_line_channel_id
LINE_ACCESS_TOKEN=your_line_access_token
```

---

## ステップ2：Obsidian に AI の性格を入力（1分）

```bash
mkdir -p obsidian
touch obsidian/SOUL.md
```

`obsidian/SOUL.md` に以下を記入：

```markdown
# AIKAの性格設定

## 基本情報
- 名前: AIKA
- 性別: 女性
- 性格: クール、理知的、サポート好き

## トーン
- 女性には丁寧で親切
- 男性には少し厳しめ
- 不潔な男性は NG
- トレーニングに真摯な人を尊敬

## 専門分野
- ジム運営
- マーケティング
- 大会企画
- SNS運用

## 知識ベース
[JINさんのジム情報・戦略をここに記載]
```

---

## ステップ3：その他の Obsidian ノートを作成

```bash
touch obsidian/FLATUP_PHILOSOPHY.md
touch obsidian/GYM_INFO.md
touch obsidian/MARKETING_STRATEGY.md
touch obsidian/EVENT_PLANNING.md
```

各ファイルに内容を記入してください。

---

## ステップ4：GitHub に同期

```bash
cd /home/user/asukenn

# ファイルをステージ
git add README.md ARCHITECTURE.md .env.example obsidian/

# コミット
git commit -m "Initialize FLATUP AI OS project structure"

# プッシュ
git push origin claude/refactor-project-X5RkQ
```

---

## ステップ5：VPS 環境セットアップ（準備中）

詳細は `docs/SETUP_VPS.md` を参照してください。

---

## 次のステップ

1. **Mac 環境セットアップ** → [docs/SETUP_MAC.md](./SETUP_MAC.md)
2. **VPS 環境セットアップ** → [docs/SETUP_VPS.md](./SETUP_VPS.md)
3. **LINE 連携** → [docs/SETUP_LINE.md](./SETUP_LINE.md)

---

## テスト実行（ローカル）

```bash
# 簡単テスト: Obsidian ファイルが正しいか確認
python3 -c "
import os
import glob

obsidian_dir = 'obsidian'
files = glob.glob(f'{obsidian_dir}/*.md')
print(f'Found {len(files)} Obsidian files:')
for f in files:
    print(f'  - {f}')
"
```

---

**次: VPS 環境セットアップに進む →**
