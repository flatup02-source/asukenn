---
description: 参考URL（X/Twitter または任意のWeb）から日本語スレッドを構成し、Typefullyへ下書き保存する
argument-hint: <参考URL> [--schedule YYYY-MM-DDTHH:MM:SSZ] [--immediate] [--no-media]
---

ユーザーから渡された参考URL: $ARGUMENTS

`.claude/skills/x-post/SKILL.md` の手順に従って、以下を実行してください:

1. 引数からURLとオプションを抽出する。URLが未指定なら止めてユーザーに尋ねる。
2. X/Twitter URL の場合は `xurl`（あれば）またはWebFetchで本文・スレッド・画像URLを取得。それ以外は WebFetch で要約取得。
3. 取得内容を、ユーザーの過去投稿スタイルに合わせて日本語スレッドに再構成（1ポスト280字以内）。要点は箇条書きで、冗長な前置きは削る。
4. 画像があり `--no-media` でなければ `.claude/skills/x-post/scripts/upload_media.js` で Typefully にアップロード。
5. `.claude/skills/x-post/scripts/create_draft.js` で Typefully v2 に下書き保存。`--schedule` 指定時のみ予約、`--immediate` 指定時のみ即時公開（要ユーザー再確認）。
6. 返ってきた share URL を提示し、終了。

明示的に指示されない限り**即時公開はしない**。下書き保存どまりがデフォルト。
