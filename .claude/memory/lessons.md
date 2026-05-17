# Lessons Learned

実装中・運用中の気づき。形式: `## YYYY-MM-DD: <要点>`

---

## 2026-05-16: WebFetch は support.typefully.com / typefully.com に対して 403 を返す
- 原因: WAF か bot 判定
- 回避: GitHub の raw URL（`raw.githubusercontent.com/typefully/agent-skills/main/...`）で取得可
- 教訓: Typefully ドキュメント参照時は raw GitHub or 公式 SDK ソースを優先する

## 2026-05-16: skills/commands は frontmatter の `description` で発火判定される
- 観察: SKILL.md 作成直後、システムリマインダのスキル一覧に即時反映された
- 教訓: description は **何のとき呼ばれるべきか** を具体的に書く（「whenever the user types /x-post or asks ...」）
