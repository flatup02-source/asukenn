---
name: x-post
description: Given a reference URL (X/Twitter post, blog, etc.), fetch the source, translate and re-compose into a Japanese X thread, optionally upload media, and save as a Typefully draft. Use whenever the user types /x-post or asks to draft an X post from a URL.
last-updated: 2026-05-16
allowed-tools:
  - Bash(./.claude/skills/x-post/scripts/*:*)
  - Bash(xurl:*)
  - WebFetch
---

# /x-post — 参考URL → Typefully下書き

## 前提
- 環境変数 `TYPEFULLY_API_KEY` が設定済み（または `.claude/skills/x-post/.env` または `~/.config/typefully/config.json`）
- 環境変数 `TYPEFULLY_SOCIAL_SET_ID` が設定済み（未設定なら `scripts/get_social_set.js list` で取得・選択）
- Node.js 18+ がインストールされている
- X/Twitter URL を扱う場合は `xurl` がインストール済みかつ認証済みである（任意・無ければWebFetchフォールバック）

## ワークフロー

### Step 1: 入力解釈
ユーザーから渡された引数からURLを抽出し、以下のオプションも見る:
- `--schedule <ISO8601>` → 予約投稿
- `--immediate` → 即時公開（要ユーザー再確認、デフォルトはしない）
- `--no-media` → 画像を無視
- `--platforms x,linkedin` → 公開先（デフォルト `x` のみ）

### Step 2: ソース取得
- **X/Twitter URL** の場合（`twitter.com` / `x.com`）:
  1. `xurl` が使えるなら `./.claude/skills/x-post/scripts/fetch_source.sh <url>` を呼ぶ（JSON返却）
  2. `xurl` が無い／失敗したら WebFetch で当該 URL を取得し、本文と画像URLを推定
- **その他のURL**: WebFetch でページを取得し、要旨・キーポイント・引用元情報をまとめる

### Step 3: 日本語スレッド構成
- 1ポスト 280字以内（日本語は半角換算で計算）
- 1ツイート目で「フック」、最後に出典URL
- 過剰な絵文字・煽り語は避ける
- 元投稿の主張は変えない（翻訳＋圧縮）。意訳の場合は「※意訳」と注記
- 画像があれば、どのポストに紐付けるか決める（通常はツイート1）

ユーザー個人のスタイルファイル `.claude/skills/x-post/style.md` があれば必ず読み込んで合わせる。

### Step 4: メディアアップロード（任意）
画像があり `--no-media` でない場合のみ:
```bash
node ./.claude/skills/x-post/scripts/upload_media.js <image_url_or_path>
# → media_id を stdout に出力
```
URLが渡された場合はスクリプト側でダウンロードしてから multipart アップロードする。

### Step 5: 下書き作成
```bash
node ./.claude/skills/x-post/scripts/create_draft.js \
  --posts-json <thread.json> \
  [--media-ids <id1,id2>] \
  [--schedule <ISO8601>] \
  [--platforms x,linkedin]
```
`thread.json` の形:
```json
[
  { "text": "1/ ..." },
  { "text": "2/ ..." },
  { "text": "3/ 出典: https://..." }
]
```
スクリプトは Typefully v2 の `POST /v2/social-sets/{id}/drafts` を叩き、share URL を返す。

### Step 6: 結果提示
- share URL をユーザーに見せる
- 何ポスト・予約日時・プラットフォームを明示
- 即時公開オプションが付いている場合は、**改めて確認してから** `--publish` で再実行

## 安全ガード
- 即時公開は明示確認なしには絶対にしない
- API キーをログに出力しない
- 取得元が non-public な場合はユーザーに警告
- スレッド長が10ポストを超える場合は分割提案

## トラブルシュート
- `social_set_id` が分からない: `node ./.claude/skills/x-post/scripts/get_social_set.js list`
- APIキーが無効: Typefully > Settings > API でキーを再発行
- v2 のフィールド名が変わった: <https://typefully.com/docs/api> を参照（2026/6/15以降は v1 廃止）
