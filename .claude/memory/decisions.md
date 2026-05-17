# Decisions Log

新しい判断は **下に append**（時系列）。形式: `## YYYY-MM-DD: <タイトル>`

---

## 2026-05-16: Typefully API v2 を採用、v1 は使わない
- 理由: v1 は 2026-06-15 廃止予定。マルチプラットフォーム対応とメディアアップロードが v2 でしか綺麗にできない。
- トレードオフ: v2 は `social_set_id` を毎回必要とする。setup スクリプトで取得・保存して回避。
- 関連: `.claude/skills/x-post/scripts/create_draft.js`

## 2026-05-16: Typefully は Agent Skill 版を主軸、公式 MCP は補助
- 理由: Skill 版はコードが手元で透明・無料・拡張自由。MCP は素早い確認用。
- トレードオフ: APIキーをローカル保管する必要あり（chmod 600 で対応）。
- 関連: `.claude/skills/x-post/README.md` の A/B 比較表

## 2026-05-16: Hybrid Human-in-the-Loop を採用、5層AI社員構造は採用しない
- 理由: 過剰自動化はBAN・品質低下リスクが高い。Codex/Browserbase 等の全自動化チェーンは持続不可能。
- トレードオフ: 完全自動運用にはならない。ただし長期的な信頼性は向上。
- 関連: `CLAUDE.md` 3章 / `.claude/skills/weekly-plan/SKILL.md`

## 2026-05-16: 永続記憶は git first（Agentmemory MCP は未導入）
- 理由: 実行環境（Claude Code on the web）は ephemeral コンテナ。外部メモリサーバは持続しない。git にコミットされたファイルだけが本当の永続層。
- トレードオフ: 動的検索や自動圧縮は無し。代わりに人間レビューが入る。
- 関連: `CLAUDE.md` 2章
