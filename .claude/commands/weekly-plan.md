---
description: 週間X運用ワークフロー（月：テーマ決定 / 火〜木：レビュー / 金：スケジュール / 日：振り返り）
argument-hint: monday | review | friday | sunday | daily | status
---

呼び出し: `/weekly-plan $ARGUMENTS`

`.claude/skills/weekly-plan/SKILL.md` のフェーズ定義に従い、引数のフェーズを実行してください。
引数なしの場合は本日の曜日から推定し、ユーザーに確認してから進めること。

- 必ず **下書き保存のみ**。スケジュールは Friday フェーズで人間承認後に限る
- 1日のスケジュール件数が 5 を超える場合は警告
- オリジナル比率が 70% を下回る計画は警告
