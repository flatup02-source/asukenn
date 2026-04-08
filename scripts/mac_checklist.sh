#!/bin/bash

# Mac初期化前 チェックリスト生成スクリプト
# 何を残すか・消すかを判断するための情報を一括でデスクトップに出力します
#
# 使い方: bash mac_checklist.sh

OUTPUT_DIR="$HOME/Desktop/mac_restore"
CHECKLIST="$OUTPUT_DIR/チェックリスト.txt"
mkdir -p "$OUTPUT_DIR"

HR="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

{
echo "$HR"
echo " Mac初期化前 チェックリスト"
echo " 生成日時: $(date '+%Y年%m月%d日 %H:%M:%S')"
echo "$HR"
echo ""

# ===== 1. ユーザーフォルダのサイズ確認 =====
echo "【1】主要フォルダのサイズ（大きい順）"
echo "$HR"
du -sh "$HOME/Desktop" "$HOME/Documents" "$HOME/Downloads" "$HOME/Movies" \
       "$HOME/Music" "$HOME/Pictures" "$HOME/Library" 2>/dev/null \
    | sort -rh | awk '{printf "  %-10s %s\n", $1, $2}'
echo ""

# ===== 2. デスクトップのファイル一覧 =====
echo "【2】デスクトップのファイル一覧"
echo "$HR"
ls -lAh "$HOME/Desktop" 2>/dev/null | awk 'NR>1 {print "  "$NF" ("$5")"}'
echo ""

# ===== 3. Downloadsフォルダ（上位20件）=====
echo "【3】Downloadsフォルダ（サイズ上位20件）"
echo "$HR"
du -sh "$HOME/Downloads/"* 2>/dev/null | sort -rh | head -20 \
    | awk '{printf "  %-10s %s\n", $1, $2}'
echo ""

# ===== 4. インストール済みアプリ =====
echo "【4】インストール済みアプリ一覧 (/Applications)"
echo "$HR"
ls /Applications/*.app 2>/dev/null | xargs -I{} basename {} .app \
    | sort | awk '{print "  [ ] "$0}'
echo ""

# ===== 5. Homebrew =====
if command -v brew &>/dev/null; then
    echo "【5】Homebrewでインストールしたもの"
    echo "$HR"
    echo "  -- formula (CLIツール) --"
    brew list --formula 2>/dev/null | sort | awk '{print "  [ ] "$0}'
    echo ""
    echo "  -- cask (GUIアプリ) --"
    brew list --cask 2>/dev/null | sort | awk '{print "  [ ] "$0}'
    echo ""
else
    echo "【5】Homebrew: 未インストール"
    echo ""
fi

# ===== 6. ブラウザのプロファイル確認 =====
echo "【6】ブラウザデータ（バックアップが必要か確認）"
echo "$HR"
for browser_dir in \
    "$HOME/Library/Application Support/Google/Chrome" \
    "$HOME/Library/Application Support/Firefox/Profiles" \
    "$HOME/Library/Application Support/BraveSoftware"; do
    if [ -d "$browser_dir" ]; then
        size=$(du -sh "$browser_dir" 2>/dev/null | awk '{print $1}')
        echo "  ✓ $(basename $(dirname $browser_dir)): $size"
    fi
done
echo "  ※ ブックマーク・パスワードはブラウザの同期機能 or エクスポートで保存"
echo ""

# ===== 7. SSH / GPG 鍵 =====
echo "【7】SSH / GPG 鍵（重要！）"
echo "$HR"
if [ -d "$HOME/.ssh" ]; then
    echo "  ⚠️  ~/.ssh が存在します（秘密鍵をバックアップ推奨）:"
    ls "$HOME/.ssh/" 2>/dev/null | awk '{print "     - "$0}'
fi
if [ -d "$HOME/.gnupg" ]; then
    echo "  ⚠️  ~/.gnupg が存在します（GPG鍵のエクスポートを推奨）"
fi
echo ""

# ===== 8. 開発環境 =====
echo "【8】開発環境"
echo "$HR"
for cmd in node python3 ruby go java; do
    if command -v $cmd &>/dev/null; then
        echo "  ✓ $cmd: $($cmd --version 2>&1 | head -1)"
    fi
done
if [ -f "$HOME/.zshrc" ] || [ -f "$HOME/.bashrc" ]; then
    echo "  ⚠️  シェルの設定ファイル(.zshrc / .bashrc)もバックアップ推奨"
fi
echo ""

# ===== 9. iCloud / Time Machine =====
echo "【9】バックアップ状況確認チェック】"
echo "$HR"
echo "  [ ] iCloudの同期が完了しているか確認"
echo "      設定 → Apple ID → iCloud → ストレージ確認"
echo "  [ ] Time Machineの最終バックアップ確認"
echo "      Apple メニュー → Time Machine → 最終バックアップ日時"
echo "  [ ] 写真.appのiCloud同期状況"
echo ""

echo "$HR"
echo " ✅ このファイルを確認しながら「残す / 消す」を判断してください"
echo " 📁 バックアップ先: USBドライブ / 外付けHDD / iCloud / Google Drive"
echo "$HR"

} | tee "$CHECKLIST"

echo ""
echo "💾 チェックリストを保存しました: $CHECKLIST"
