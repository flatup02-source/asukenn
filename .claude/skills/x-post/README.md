# /x-post — Typefully × Claude Code 自動化スキル

参考URL（X/Twitter のスレッド、ブログ等）から日本語スレッドを構成し、
Typefully に下書き保存するための Claude Code スキルです。

> チャエン氏 (@masahirochaen) が紹介した `/x-post` の最短再現＋拡張版。

## 構成

```
.claude/
├── commands/x-post.md          # スラッシュコマンド
└── skills/x-post/
    ├── SKILL.md                # 自動発火するスキル本体
    ├── README.md               # （このファイル）セットアップ手順
    ├── .env.example            # 必要な環境変数の例
    ├── style.example.md        # 個人スタイルガイドの雛形
    └── scripts/
        ├── lib.js              # 共通fetch/設定ロード
        ├── get_social_set.js   # social_set_id を取得
        ├── upload_media.js     # メディアアップロード
        ├── create_draft.js     # v2 下書き作成
        ├── fetch_source.sh     # xurl で X 投稿取得
        └── setup.sh            # 対話的セットアップ
```

## 2つの導入経路

### A. Agent Skill（このリポに入っている方法・推奨）

1. Typefully の API キーを取得: <https://typefully.com/?settings=api>
2. 対話セットアップ:
   ```bash
   ./.claude/skills/x-post/scripts/setup.sh
   ```
   `~/.config/typefully/config.json` に保存（chmod 600）。
   または環境変数で:
   ```bash
   export TYPEFULLY_API_KEY=tk_xxx
   export TYPEFULLY_SOCIAL_SET_ID=ss_xxx
   ```
3. `xurl` を使う場合（任意）: <https://github.com/twitterdev/xurl> をインストールし `xurl auth` 済みであること。
4. Claude Code を起動して `/x-post https://x.com/...` を実行。

### B. 公式 Typefully MCP Server（最短・サーバー実行）

1. Typefully の Settings → Integrations → MCP で **個別の HTTP MCP URL** を発行。
2. Claude Code に登録:
   ```bash
   claude mcp add typefully --transport http --url "https://mcp.typefully.com/<your-token>"
   ```
   または `.mcp.example.json` を `.mcp.json` にコピーして編集（共有したくない場合は `.mcp.local.json`）。
3. これだけで「下書きを作って」「予約して」が自然言語で通る。
4. **取得層（xurl/WebFetch）は MCP に含まれない**ので、`/x-post` のスラッシュコマンドはそのまま使い、Typefully 部分だけ MCP に置き換えてもよい。

### A と B の比較

| 観点 | A. Agent Skill | B. MCP Server |
|---|---|---|
| 認証保管 | ローカル | Typefully側 |
| カスタム性 | ◎ JS を書き換え自由 | △ サーバー実装に依存 |
| Typefully以外の処理 | 同じスキル内に統合可 | 別スキルで包む必要 |
| 料金 | API キーだけで無料 | Typefullyプラン依存の可能性 |
| デバッグ | コード手元・ログ可視 | ブラックボックス気味 |

実運用は **A をベースに B を併用** が無難。MCP は「素早く確認したいとき」用、Skill は「長期運用・パイプライン化」用。

## 使い方

```
/x-post https://x.com/<user>/status/<id>
/x-post https://example.com/blog/post --platforms x,linkedin
/x-post https://x.com/.../status/... --schedule 2026-05-20T08:00:00Z
/x-post https://... --no-media
```

- デフォルトは **下書き保存のみ**（公開しません）
- `--immediate` を付けると公開フローに入りますが、Claude が再確認します

## v1/v2 注意

このスキルは Typefully **API v2** を使用します。v1 は 2026/6/15 で廃止予定。
最新仕様: <https://typefully.com/docs/api>

## セキュリティ

- `TYPEFULLY_API_KEY` をリポジトリにコミットしない（`.gitignore` 済み）
- `~/.config/typefully/config.json` は chmod 600
- スレッド全体を一度ユーザーに見せてから下書き作成する運用を推奨

## 参考

- <https://github.com/typefully/agent-skills>（公式 Agent Skill。`drafts:create` などのCLIラッパが豊富）
- <https://support.typefully.com/en/articles/13128440-typefully-mcp-server>
- <https://support.typefully.com/en/articles/13133296-typefully-api-v1-v2-migration-guide>
