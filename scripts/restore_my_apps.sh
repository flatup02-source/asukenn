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
echo -e "${YELLOW}[1/4] Homebrew のセットアップ${NC}"
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
    brew update
    echo -e "${GREEN}✅ Homebrew 最新版に更新済み${NC}"
fi
echo ""

# ===== Step 2: Node.js (最新版) =====
echo -e "${YELLOW}[2/4] Node.js (最新版) のセットアップ${NC}"
# nvm 経由でインストール（バージョン管理できる）
if ! command -v nvm &>/dev/null; then
    echo "nvm をインストールしています..."
    brew install nvm
    mkdir -p "$HOME/.nvm"
    # .zprofile に設定を追記（重複しないようにチェック）
    if ! grep -q 'NVM_DIR' "$HOME/.zprofile" 2>/dev/null; then
        {
            echo ''
            echo '# nvm'
            echo 'export NVM_DIR="$HOME/.nvm"'
            echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"'
            echo '[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"'
        } >> "$HOME/.zprofile"
    fi
    # 現在のシェルに読み込む
    export NVM_DIR="$HOME/.nvm"
    [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
fi
# Node.js 最新版をインストール
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
nvm install node          # 最新版
nvm alias default node    # デフォルトに設定
echo -e "${GREEN}✅ Node.js $(node --version) インストール完了${NC}"
echo -e "${GREEN}✅ npm $(npm --version) インストール完了${NC}"
echo ""

# ===== Step 3: Homebrew cask でGUIアプリ =====
echo -e "${YELLOW}[3/4] Homebrew でGUIアプリをインストール${NC}"

CASKS=(
    "visual-studio-code"   # VS Code
    "brave-browser"        # Brave ブラウザ
    "google-chrome"        # Google Chrome
    "google-drive"         # Google ドライブ
    "obsidian"             # Obsidian
    "capcut"               # CapCut
    "sourcetree"           # Sourcetree (Git GUI)
    "onyx"                 # Onyx (Macシステムユーティリティ)
    "ollama"               # Ollama (ローカルLLM実行環境)
)

for cask in "${CASKS[@]}"; do
    if brew list --cask "$cask" &>/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ 既にインストール済み: $cask${NC}"
    else
        echo -e "  ${BLUE}⬇️  インストール中: $cask${NC}"
        brew install --cask "$cask" && echo -e "  ${GREEN}✅ 完了: $cask${NC}"
    fi
done
echo ""

# ===== Step 4: 手動インストールが必要なアプリ =====
echo -e "${YELLOW}[4/4] 手動でインストールが必要なアプリ${NC}"
echo ""
echo "  ━━━ App Store から ━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  [ ] Sing All          → App Store で「Sing All」検索"
echo "  [ ] Uno               → App Store で「Uno」検索"
echo "  [ ] ボイスインク       → App Store で「VoiceInk」検索"
echo ""
echo "  ━━━ 公式サイト / 直接ダウンロード ━━━━━━━━━━━━"
echo "  [ ] Claude AI Studio  → claude.ai (Webで使用 or デスクトップ版)"
echo "  [ ] Antigravity       → 購入元 / 公式サイトから再ダウンロード"
echo "  [ ] ClawX             → 購入元 / 公式サイトから再ダウンロード"
echo ""
echo "  ━━━ Web アプリ（インストール不要）━━━━━━━━━━━"
echo "  [ ] Google シート     → sheets.google.com"
echo "  [ ] NotebookLM        → notebooklm.google.com"
echo ""

# ===== 完了メッセージ =====
echo "=============================="
echo -e "${GREEN}✅ 自動インストール完了！${NC}"
echo ""
echo "次にやること:"
echo "  1. ターミナルを再起動して node / npm コマンドを確認"
echo "     → node --version  npm --version"
echo "  2. Chrome / Brave にアカウントでログイン（ブックマーク・拡張機能が同期）"
echo "  3. Google ドライブを起動してアカウントにログイン"
echo "  4. Obsidian の Vault をバックアップから復元（iCloud推奨）"
echo "  5. VS Code の設定同期: アカウントアイコン → Turn on Settings Sync"
echo "  6. Ollama でモデルをダウンロード（例: ollama pull llama3）"
echo "=============================="
