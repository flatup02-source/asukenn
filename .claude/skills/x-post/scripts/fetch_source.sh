#!/usr/bin/env bash
# Fetch an X/Twitter post (full thread + media) via xurl.
# Outputs JSON to stdout. Falls back to a stub when xurl is unavailable;
# the caller should then use WebFetch instead.
set -euo pipefail

URL="${1:-}"
if [[ -z "$URL" ]]; then
  echo '{"error":"missing url argument"}' >&2
  exit 2
fi

TWEET_ID="$(echo "$URL" | sed -E 's#.*/status/([0-9]+).*#\1#')"
if [[ -z "$TWEET_ID" || "$TWEET_ID" == "$URL" ]]; then
  echo "{\"error\":\"cannot extract tweet id from $URL\"}" >&2
  exit 3
fi

if ! command -v xurl >/dev/null 2>&1; then
  echo '{"error":"xurl not installed","fallback":"webfetch"}' >&2
  exit 10
fi

FIELDS="tweet.fields=created_at,text,attachments,entities,referenced_tweets,conversation_id,author_id"
EXPANSIONS="expansions=attachments.media_keys,author_id,referenced_tweets.id"
MEDIA="media.fields=url,preview_image_url,type,alt_text"

xurl "/2/tweets/${TWEET_ID}?${FIELDS}&${EXPANSIONS}&${MEDIA}"
