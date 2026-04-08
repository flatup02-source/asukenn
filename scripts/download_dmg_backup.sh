#!/bin/bash

# アプリDMGバックアップスクリプト
# 初期化前にアプリのインストーラーをまとめてダウンロード・保存します
# 使い方: bash download_dmg_backup.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

BACKUP_DIR="$HOME/Desktop/mac_restore/アプリインストーラー"
mkdir -p "$BACKUP_DIR"

echo "=============================="
echo " アプリインストーラーを保存します"
echo " 保存先: $BACKUP_DIR"
echo "=============================="
echo ""

# Homebrew が必要
if ! command -v brew &>/dev/null; then
    echo -e "${RED}❌ Homebrew がインストールされていません${NC}"
    echo "先に brew をインストールしてください:"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    exit 1
fi

# ===== Homebrew cask のインストーラーをダウンロード =====
echo -e "${YELLOW}[1/2] Homebrewからインストーラーをダウンロード${NC}"
echo ""

CASKS=(
    "visual-studio-code"
    "brave-browser"
    "google-chrome"
    "google-drive"
    "obsidian"
    "capcut"
    "sourcetree"
    "onyx"
    "ollama"
)

for cask in "${CASKS[@]}"; do
    echo -e "  ${BLUE}⬇️  $cask をダウンロード中...${NC}"
    brew fetch --cask "$cask" 2>/dev/null && \
        echo -e "  ${GREEN}✅ $cask 完了${NC}" || \
        echo -e "  ${RED}⚠️  $cask 失敗（スキップ）${NC}"
done

# Homebrewキャッシュからバックアップフォルダへコピー
echo ""
echo -e "${YELLOW}バックアップフォルダへコピー中...${NC}"
BREW_CACHE="$(brew --cache)/downloads"
if [ -d "$BREW_CACHE" ]; then
    find "$BREW_CACHE" -name "*.dmg" -o -name "*.zip" -o -name "*.pkg" 2>/dev/null | while read f; do
        cp "$f" "$BACKUP_DIR/" 2>/dev/null && echo -e "  ${GREEN}✅ $(basename "$f")${NC}"
    done
fi

# ===== すでにiCloudにあるDMGもコピー =====
echo ""
echo -e "${YELLOW}[2/2] iCloud内の既存DMGをコピー${NC}"

ICLOUD="$HOME/Library/Mobile Documents/com~apple~CloudDocs"
if [ -d "$ICLOUD" ]; then
    find "$ICLOUD" -name "*.dmg" 2>/dev/null | grep -v "\.Trash" | while read f; do
        echo -e "  ${BLUE}コピー中: $(basename "$f")${NC}"
        cp "$f" "$BACKUP_DIR/" 2>/dev/null && echo -e "  ${GREEN}✅ $(basename "$f")${NC}"
    done
fi

# ===== 結果確認 =====
echo ""
echo "=============================="
echo -e "${GREEN}✅ 完了！保存されたファイル一覧:${NC}"
echo "=============================="
ls -lh "$BACKUP_DIR" | awk 'NR>1 {printf "  %-10s %s\n", $5, $NF}'
echo ""
echo -e "${YELLOW}⚠️  手動ダウンロードが必要なもの:${NC}"
echo "  [ ] Antigravity  → 購入時のメールまたは公式サイトから"
echo "  [ ] ClawX        → iCloudにDMGあり ✅"
echo ""
echo "保存先フォルダ: $BACKUP_DIR"
echo "このフォルダをUSBや外付けHDDにもコピーしておくと確実です"
