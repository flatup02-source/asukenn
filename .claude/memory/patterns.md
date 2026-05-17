# Patterns

再利用しやすいコード/プロンプトの雛形。日付は任意。

---

## Typefully v2 リクエストの共通ヘルパ
- 場所: `.claude/skills/x-post/scripts/lib.js`
- ポイント: `loadConfig()` で env → project json → user json の順に解決。`typefullyFetch()` は FormData も JSON も透過対応。
- 他スキルから使うときは相対パス import:
  ```js
  import { typefullyFetch, parseArgs } from '../../x-post/scripts/lib.js';
  ```

## スキル用スラッシュコマンドの最小形
- `.claude/commands/<name>.md` に frontmatter + 簡潔な手順だけ書く
- 重い処理は `.claude/skills/<name>/SKILL.md` 側で定義し、コマンドは「SKILL.md に従え」と委譲する
- 引数は `$ARGUMENTS` で受ける

## 公開前の二重承認テンプレ
- ドラフト作成後にユーザーへ全文提示 → 「公開しますか？」→ Yes でのみ `--publish` を付ける
- AI が自分の判断で `--immediate` を付けない
