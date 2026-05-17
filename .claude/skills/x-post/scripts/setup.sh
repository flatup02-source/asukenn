#!/usr/bin/env bash
# Interactive setup: stores Typefully API key + default social set id.
set -euo pipefail

CONFIG_DIR="${HOME}/.config/typefully"
CONFIG_FILE="${CONFIG_DIR}/config.json"
mkdir -p "$CONFIG_DIR"
chmod 700 "$CONFIG_DIR"

read -rp "Typefully API key (from https://typefully.com/?settings=api): " KEY
if [[ -z "$KEY" ]]; then
  echo "Aborted: empty key." >&2
  exit 1
fi

echo "Fetching your social sets..."
SETS=$(TYPEFULLY_API_KEY="$KEY" node "$(dirname "$0")/get_social_set.js" list)
echo "$SETS"

read -rp "Default social set id (paste one id from above): " SID

cat > "$CONFIG_FILE" <<JSON
{
  "apiKey": "${KEY}",
  "defaultSocialSetId": "${SID}",
  "socialSetId": "${SID}"
}
JSON
chmod 600 "$CONFIG_FILE"

echo "Saved to ${CONFIG_FILE} (chmod 600)."
echo "You can also set: export TYPEFULLY_API_KEY=... ; export TYPEFULLY_SOCIAL_SET_ID=..."
