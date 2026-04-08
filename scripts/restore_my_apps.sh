#!/bin/bash

# 個人アプリ復元スクリプト
# Mac初期化後に実行してください
# 使い方: bash restore_my_apps.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=============================="
echo " アプリ復元を開始します"
echo "=============================="
echo ""

# ===== Step 1: Homebrew インストール =====
echo -e "${YELLOW}[1/3] Homebrew のセットアップ${NC}"
if ! command -v brew &>/dev/null; then
    echo "Homebrew をインストールしています..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Apple Silicon Mac の場合パスを通す
    if [ -f /opt/homebrew/bin/brew ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
    fi
    echo -e "${GREEN}✅ Homebrew インストール完了${NC}"
else
    echo -e "${GREEN}✅ Homebrew は既にインストール済み${NC}"
fi
echo ""

# ===== Step 2: Homebrew で自動インストール =====
echo -e "${YELLOW}[2/3] Homebrew でインストール${NC}"

CASKS=(
    "visual-studio-code"   # VS Code
    "brave-browser"        # Brave ブラウザ
    "google-chrome"        # Google Chrome
    "google-drive"         # Google ドライブ (デスクトップ同期)
    "obsidian"             # Obsidian
    "capcut"               # CapCut
    "sourcetree"           # Sourcetree (Git GUI)
)

for cask in "${CASKS[@]}"; do
    app_name=$(echo "$cask" | sed 's/-/ /g')
    if brew list --cask "$cask" &>/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ 既にインストール済み: $cask${NC}"
    else
        echo -e "  ${BLUE}⬇️  インストール中: $cask${NC}"
        brew install --cask "$cask" && echo -e "  ${GREEN}✅ 完了: $cask${NC}"
    fi
done
echo ""

# ===== Step 3: 手動インストールが必要なアプリ =====
echo -e "${YELLOW}[3/3] 手動でインストールが必要なアプリ${NC}"
echo ""

echo "  以下のアプリは手動でインストールしてください："
echo ""

echo "  ━━━ App Store から ━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  [ ] CapCut            → App Store で「CapCut」検索"
echo "  [ ] Sing All          → App Store で「Sing All」検索"
echo "  [ ] Uno               → App Store で「Uno」検索"
echo "  [ ] ボイスインク       → App Store で「VoiceInk」検索"
echo ""

echo "  ━━━ 公式サイト / 直接ダウンロード ━━━━━━━━━━━━"
echo "  [ ] Claude AI Studio  → claude.ai (Webで使用 or デスクトップ版)"
echo "  [ ] アンチグラビティ  → 購入元 / 公式サイトから再ダウンロード"
echo "  [ ] クローX           → 購入元 / 公式サイトから再ダウンロード"
echo "  [ ] ラマオニキス       → 購入元 / 公式サイトから再ダウンロード"
echo ""

echo "  ━━━ Web アプリ（インストール不要）━━━━━━━━━━━"
echo "  [ ] Google シート     → sheets.google.com (ブラウザで使用)"
echo "  [ ] NotebookLM        → notebooklm.google.com (ブラウザで使用)"
echo ""

# ===== 完了メッセージ =====
echo "=============================="
echo -e "${GREEN}✅ 自動インストール完了！${NC}"
echo ""
echo "次にやること:"
echo "  1. 上の「手動インストール」リストを確認して残りをインストール"
echo "  2. Google Chrome / Brave にアカウントでログイン（ブックマーク・拡張機能が同期されます）"
echo "  3. Google ドライブを起動してアカウントにログイン"
echo "  4. Obsidian の Vault フォルダをバックアップから復元（iCloud推奨）"
echo "  5. VS Code の設定同期: アカウントアイコン → Turn on Settings Sync"
echo "=============================="
