#!/bin/bash

# デスクトップ整理スクリプト (Mac用)
# 使い方:
#   bash organize_desktop.sh          # 実際に整理を実行
#   bash organize_desktop.sh --dry-run # 移動プレビュー（実際には移動しない）
#
# 実行前にバックアップを推奨します

DESKTOP="$HOME/Desktop"
DRY_RUN=false
MOVED=0
LOG_FILE="$DESKTOP/整理ログ_$(date '+%Y%m%d_%H%M%S').txt"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 引数解析
for arg in "$@"; do
    case "$arg" in
        --dry-run|-n) DRY_RUN=true ;;
        --help|-h)
            echo "使い方: $0 [オプション]"
            echo "  --dry-run, -n  移動プレビュー（実際には移動しない）"
            echo "  --help, -h     このヘルプを表示"
            exit 0
            ;;
    esac
done

if $DRY_RUN; then
    echo -e "${YELLOW}[ドライランモード] 実際にはファイルを移動しません${NC}"
    echo ""
fi

# 安全な移動関数（重複ファイル名を自動リネーム）
safe_move() {
    local src="$1"
    local dest_dir="$2"
    local dest="$dest_dir/$(basename "$src")"

    # 重複ファイル名の処理
    if [ -e "$dest" ]; then
        local base="${dest%.*}"
        local ext="${dest##*.}"
        local counter=1
        while [ -e "${base}_${counter}.${ext}" ]; do
            ((counter++))
        done
        dest="${base}_${counter}.${ext}"
    fi

    if $DRY_RUN; then
        echo -e "  ${BLUE}[移動予定]${NC} $(basename "$src") → $(basename "$dest_dir")/"
    else
        mv "$src" "$dest"
        echo -e "  ${GREEN}[移動完了]${NC} $(basename "$src") → $(basename "$dest_dir")/"
        echo "$(date '+%H:%M:%S') | $(basename "$src") → $(basename "$dest_dir")/" >> "$LOG_FILE"
    fi
    ((MOVED++))
}

# 拡張子の大文字・小文字両方にマッチするファイル一覧取得（macOS互換）
get_files_by_ext() {
    local dir="$1"
    local ext="$2"
    # find で大文字・小文字を無視してマッチ（macOS対応）
    find "$dir" -maxdepth 1 -iname "*.$ext" -type f 2>/dev/null
}

# フォルダ作成（ドライランでは作成しない）
create_dirs() {
    if ! $DRY_RUN; then
        mkdir -p "$DESKTOP/📷 スクリーンショット"
        mkdir -p "$DESKTOP/📸 画像"
        mkdir -p "$DESKTOP/📄 書類"
        mkdir -p "$DESKTOP/🎬 動画"
        mkdir -p "$DESKTOP/🎵 音楽"
        mkdir -p "$DESKTOP/📦 アーカイブ"
        mkdir -p "$DESKTOP/💻 アプリ"
        mkdir -p "$DESKTOP/📁 その他"
    fi
}

create_dirs
echo "デスクトップの整理を開始します..."
echo ""

# ---------- スクリーンショット ----------
echo -e "${YELLOW}📷 スクリーンショット${NC}"
while IFS= read -r f; do
    [ -f "$f" ] && safe_move "$f" "$DESKTOP/📷 スクリーンショット"
done < <(find "$DESKTOP" -maxdepth 1 -type f \( -iname "スクリーンショット *.png" -o -iname "Screenshot *.png" \) 2>/dev/null)

# ---------- 画像 ----------
echo -e "${YELLOW}📸 画像${NC}"
for ext in jpg jpeg png gif webp heic heif bmp tiff tif svg; do
    while IFS= read -r f; do
        # スクリーンショットは除外（すでに移動済み）
        [ -f "$f" ] && safe_move "$f" "$DESKTOP/📸 画像"
    done < <(get_files_by_ext "$DESKTOP" "$ext")
done

# ---------- 書類 ----------
echo -e "${YELLOW}📄 書類${NC}"
for ext in pdf doc docx xls xlsx ppt pptx txt md rtf pages numbers key csv; do
    while IFS= read -r f; do
        [ -f "$f" ] && safe_move "$f" "$DESKTOP/📄 書類"
    done < <(get_files_by_ext "$DESKTOP" "$ext")
done

# ---------- 動画 ----------
echo -e "${YELLOW}🎬 動画${NC}"
for ext in mp4 mov avi mkv wmv flv m4v webm; do
    while IFS= read -r f; do
        [ -f "$f" ] && safe_move "$f" "$DESKTOP/🎬 動画"
    done < <(get_files_by_ext "$DESKTOP" "$ext")
done

# ---------- 音楽 ----------
echo -e "${YELLOW}🎵 音楽${NC}"
for ext in mp3 wav aac flac m4a aiff ogg wma; do
    while IFS= read -r f; do
        [ -f "$f" ] && safe_move "$f" "$DESKTOP/🎵 音楽"
    done < <(get_files_by_ext "$DESKTOP" "$ext")
done

# ---------- アーカイブ ----------
echo -e "${YELLOW}📦 アーカイブ${NC}"
for ext in zip rar tar gz 7z bz2 xz dmg pkg; do
    while IFS= read -r f; do
        [ -f "$f" ] && safe_move "$f" "$DESKTOP/📦 アーカイブ"
    done < <(get_files_by_ext "$DESKTOP" "$ext")
done

# ---------- アプリ ----------
echo -e "${YELLOW}💻 アプリ${NC}"
for f in "$DESKTOP"/*.app; do
    if [ -d "$f" ]; then
        if $DRY_RUN; then
            echo -e "  ${BLUE}[移動予定]${NC} $(basename "$f") → 💻 アプリ/"
        else
            mv "$f" "$DESKTOP/💻 アプリ/"
            echo -e "  ${GREEN}[移動完了]${NC} $(basename "$f") → 💻 アプリ/"
        fi
        ((MOVED++))
    fi
done

# ---------- その他（未分類ファイル） ----------
echo -e "${YELLOW}📁 その他${NC}"
while IFS= read -r f; do
    [ -f "$f" ] && safe_move "$f" "$DESKTOP/📁 その他"
done < <(find "$DESKTOP" -maxdepth 1 -type f ! -name ".DS_Store" ! -name "整理ログ_*.txt" 2>/dev/null)

# ---------- 空フォルダを削除 ----------
if ! $DRY_RUN; then
    for dir in \
        "$DESKTOP/📸 画像" \
        "$DESKTOP/📄 書類" \
        "$DESKTOP/🎬 動画" \
        "$DESKTOP/🎵 音楽" \
        "$DESKTOP/📦 アーカイブ" \
        "$DESKTOP/📷 スクリーンショット" \
        "$DESKTOP/💻 アプリ" \
        "$DESKTOP/📁 その他"; do
        [ -d "$dir" ] && [ -z "$(ls -A "$dir")" ] && rmdir "$dir"
    done
fi

# ---------- 結果サマリー ----------
echo ""
echo "================================"
if $DRY_RUN; then
    echo -e "${YELLOW}[ドライラン完了]${NC} 移動予定ファイル数: ${MOVED} 件"
    echo "実際に整理するには: bash organize_desktop.sh"
else
    echo -e "${GREEN}✅ 整理完了！${NC} 移動ファイル数: ${MOVED} 件"
    if [ $MOVED -gt 0 ]; then
        echo "ログファイル: $LOG_FILE"
    else
        [ -f "$LOG_FILE" ] && rm "$LOG_FILE"
    fi
fi
echo "================================"
