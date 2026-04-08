#!/bin/bash

# Macアプリバックアップスクリプト
# 初期化前に実行して、インストール済みアプリの一覧と復元スクリプトを生成します
#
# 使い方:
#   bash mac_backup_apps.sh
#
# 生成ファイル:
#   ~/Desktop/mac_restore/アプリ一覧.txt      ... インストール済みアプリの一覧
#   ~/Desktop/mac_restore/restore.sh          ... 初期化後に実行する復元スクリプト

set -euo pipefail

OUTPUT_DIR="$HOME/Desktop/mac_restore"
APP_LIST="$OUTPUT_DIR/アプリ一覧.txt"
RESTORE_SCRIPT="$OUTPUT_DIR/restore.sh"

mkdir -p "$OUTPUT_DIR"

echo "=============================="
echo " Mac アプリバックアップ開始"
echo "=============================="
echo ""

# ===== アプリ一覧.txt の生成 =====
{
    echo "# Macアプリ一覧"
    echo "# 生成日時: $(date '+%Y年%m月%d日 %H:%M:%S')"
    echo ""

    # /Applications のアプリ
    echo "## /Applications にインストールされているアプリ"
    echo "---"
    ls /Applications/*.app 2>/dev/null | xargs -I{} basename {} .app | sort
    echo ""

    # Homebrew インストール済み（あれば）
    if command -v brew &>/dev/null; then
        echo "## Homebrew - formulas (CLI ツール)"
        echo "---"
        brew list --formula 2>/dev/null | sort
        echo ""

        echo "## Homebrew - casks (GUIアプリ)"
        echo "---"
        brew list --cask 2>/dev/null | sort
        echo ""
    else
        echo "## Homebrew: 未インストール"
        echo ""
    fi

    # App Store アプリ（mas-cli があれば）
    if command -v mas &>/dev/null; then
        echo "## App Store アプリ"
        echo "---"
        mas list 2>/dev/null
        echo ""
    else
        echo "## App Store アプリ: mas-cli 未インストールのため取得不可"
        echo "# ※ App Store の「購入済み」タブから確認できます"
        echo ""
    fi

    # npm グローバルパッケージ（あれば）
    if command -v npm &>/dev/null; then
        echo "## npm グローバルパッケージ"
        echo "---"
        npm list -g --depth=0 2>/dev/null | tail -n +2
        echo ""
    fi

    # pip グローバルパッケージ（あれば）
    if command -v pip3 &>/dev/null; then
        echo "## pip グローバルパッケージ"
        echo "---"
        pip3 list 2>/dev/null
        echo ""
    fi

} > "$APP_LIST"

echo "✅ アプリ一覧を保存しました: $APP_LIST"

# ===== restore.sh の生成 =====
{
    echo "#!/bin/bash"
    echo ""
    echo "# Mac 復元スクリプト"
    echo "# 初期化後、このスクリプトを実行してアプリを再インストールします"
    echo "# 生成日時: $(date '+%Y年%m月%d日 %H:%M:%S')"
    echo ""
    echo "set -e"
    echo ""

    # Homebrew インストール
    echo "# ===== Homebrew のインストール ====="
    echo 'if ! command -v brew &>/dev/null; then'
    echo '    echo "Homebrew をインストールします..."'
    echo '    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo 'else'
    echo '    echo "Homebrew は既にインストールされています"'
    echo 'fi'
    echo ""

    # Homebrew formulas の復元
    if command -v brew &>/dev/null; then
        FORMULAS=$(brew list --formula 2>/dev/null | sort | tr '\n' ' ')
        CASKS=$(brew list --cask 2>/dev/null | sort | tr '\n' ' ')

        if [ -n "$FORMULAS" ]; then
            echo "# ===== Homebrew formula (CLI ツール) ====="
            echo "brew install $FORMULAS"
            echo ""
        fi

        if [ -n "$CASKS" ]; then
            echo "# ===== Homebrew cask (GUIアプリ) ====="
            echo "brew install --cask $CASKS"
            echo ""
        fi
    fi

    # App Store アプリの復元
    if command -v mas &>/dev/null; then
        echo "# ===== App Store アプリ ====="
        echo "# mas-cli をインストールして App Store アプリを復元"
        echo "brew install mas"
        mas list 2>/dev/null | awk '{print "mas install "$1" # "$2}' | sort
        echo ""
    else
        echo "# ===== App Store アプリ ====="
        echo "# App Store の「購入済み」タブから手動で再インストールしてください"
        echo ""
    fi

    echo 'echo ""'
    echo 'echo "=============================="'
    echo 'echo " 復元完了！"'
    echo 'echo "=============================="'

} > "$RESTORE_SCRIPT"

chmod +x "$RESTORE_SCRIPT"

echo "✅ 復元スクリプトを保存しました: $RESTORE_SCRIPT"

echo ""
echo "=============================="
echo " 完了！次のステップ:"
echo "=============================="
echo ""
echo "1. ~/Desktop/mac_restore/ フォルダをUSBや外付けHDD、またはiCloudに保存"
echo "2. 重要なデータをバックアップ (書類、写真、Downloadsフォルダ など)"
echo "3. Macを初期化 (Apple メニュー → システム設定 → 一般 → 転送またはリセット)"
echo "4. 初期化後に restore.sh を実行してアプリを復元"
echo ""
echo "⚠️  App Storeのアプリは購入済みタブからも復元できます"
echo "⚠️  Adobe / Microsoft など個別ライセンスのアプリは手動でダウンロードが必要です"
