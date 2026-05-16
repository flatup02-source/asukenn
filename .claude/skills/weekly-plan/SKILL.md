---
name: weekly-plan
description: 週間X運用ワークフロー。月曜にテーマとバケット計画を作り、火〜木で下書きをレビューし、金曜にまとめてスケジュール、日曜に分析・振り返り。1日2〜5投稿・オリジナル70%以上を強制。Use whenever the user runs /weekly-plan or asks about weekly content planning.
last-updated: 2026-05-16
allowed-tools:
  - Bash(./.claude/skills/weekly-plan/scripts/*:*)
  - Bash(./.claude/skills/x-post/scripts/*:*)
  - Read
  - Write
  - Edit
---

# 週間Xワークフロー (Hybrid Human-in-the-Loop)

「AIをインターン、人間を責任者」。**全てのフェーズで最終決定は人間**。
週ファイルは `.claude/skills/weekly-plan/themes/YYYY-Www.md`（ISO週番号）に保存。

## ガードレール
- **公開は人間の明示承認後のみ**。AIが勝手に `--immediate` を付けない。
- 1日のスケジュール件数 ≤ 5。これを超える計画は警告し、分散提案する。
- **オリジナル ≥ 70%**。翻訳・引用解説スレッドは週全体の30%まで。
- バケット配分は **教育40% / エンゲージ30% / プロモート15% / パーソナル15%** を目安に。逸脱時は提案するが強制はしない。

## フェーズ

### Monday — テーマ＆計画策定
1. 直近2週間の自分の投稿傾向を `scripts/analytics.js` で取得し、伸びた投稿の特徴をユーザーに提示。
2. `templates/theme.md` を `themes/YYYY-Www.md` にコピーし、ユーザーと対話して埋める:
   - 今週のテーマ（1つ）
   - マスターコンテンツ（ブログ・動画・分析）の有無
   - バケット別の投稿数目標
3. 計画が確定したら、ユーザー承認を取って保存。**この時点では下書きは作らない**。

### Tue-Wed-Thu — レビュー & ドラフト
1. `scripts/list_drafts.js` で Typefully にある下書き一覧を取得。
2. ユーザーと一緒に1件ずつレビュー:
   - 文面の修正提案
   - バケット分類タグの確認
   - メディア有無
3. 新規ドラフトが必要なら `/x-post <URL>` または手元のネタから生成（`x-post` スキルに委譲）。
4. 確定したドラフトは Typefully 上に残すだけ。**まだスケジュールしない**。

### Friday — まとめてスケジュール
1. `scripts/list_drafts.js` で今週用ドラフト一覧を再取得。
2. `themes/YYYY-Www.md` の配分目標と照合:
   - 件数オーバー → 翌週送り提案
   - バケット偏り → 入れ替え提案
   - オリジナル比率 < 70% → 警告
3. ユーザー承認後、各ドラフトを `/x-post` の `--schedule` で再保存するか、Typefully UI でスケジュールするよう案内。
4. スケジュール後、`scripts/list_queue.js` で来週ぶんのキューを表示して確認。

### Daily (任意) — 朝のチェック
1. `scripts/list_queue.js` で今日の予約投稿を確認。
2. 重要リプライがあればユーザーに知らせる（自動返信はしない）。
3. 緊急修正があれば `/x-post` を再走。

### Sunday — 振り返り
1. `scripts/analytics.js --days 7` で先週分の数値を取得。
2. `templates/retro.md` を `themes/YYYY-Www.md` の末尾に追記し、ユーザーと埋める:
   - 伸びた投稿 / 沈んだ投稿
   - バケット別パフォーマンス
   - 来週への学び（1〜3個）
3. 次週の `themes/YYYY-Wxx.md` 雛形を生成し、Monday フェーズに備える。

## status コマンド
`/weekly-plan status` で:
- 今週ファイルの存在チェック
- 現時点の下書き数とバケット分布
- 次の予約投稿
を一覧表示。
