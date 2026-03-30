#!/bin/bash

# デスクトップ整理スクリプト (Mac用)
# 実行前にバックアップを推奨します

DESKTOP="$HOME/Desktop"

# フォルダ作成
mkdir -p "$DESKTOP/📸 画像"
mkdir -p "$DESKTOP/📄 書類"
mkdir -p "$DESKTOP/🎬 動画"
mkdir -p "$DESKTOP/🎵 音楽"
mkdir -p "$DESKTOP/📦 アーカイブ"
mkdir -p "$DESKTOP/📷 スクリーンショット"
mkdir -p "$DESKTOP/💻 アプリ"
mkdir -p "$DESKTOP/📁 その他"

echo "フォルダを作成しました。整理を開始します..."

# スクリーンショット (Macのデフォルト命名規則)
for f in "$DESKTOP"/スクリーンショット\ *.png "$DESKTOP"/Screenshot\ *.png; do
    [ -f "$f" ] && mv "$f" "$DESKTOP/📷 スクリーンショット/" && echo "スクリーンショット: $(basename "$f")"
done

# 画像
for ext in jpg jpeg png gif webp heic bmp tiff svg; do
    for f in "$DESKTOP"/*.$ext "$DESKTOP"/*.${ext^^}; do
        [ -f "$f" ] && mv "$f" "$DESKTOP/📸 画像/" && echo "画像: $(basename "$f")"
    done
done

# 書類
for ext in pdf doc docx xls xlsx ppt pptx txt md pages numbers key csv; do
    for f in "$DESKTOP"/*.$ext "$DESKTOP"/*.${ext^^}; do
        [ -f "$f" ] && mv "$f" "$DESKTOP/📄 書類/" && echo "書類: $(basename "$f")"
    done
done

# 動画
for ext in mp4 mov avi mkv wmv flv m4v; do
    for f in "$DESKTOP"/*.$ext "$DESKTOP"/*.${ext^^}; do
        [ -f "$f" ] && mv "$f" "$DESKTOP/🎬 動画/" && echo "動画: $(basename "$f")"
    done
done

# 音楽
for ext in mp3 wav aac flac m4a aiff; do
    for f in "$DESKTOP"/*.$ext "$DESKTOP"/*.${ext^^}; do
        [ -f "$f" ] && mv "$f" "$DESKTOP/🎵 音楽/" && echo "音楽: $(basename "$f")"
    done
done

# アーカイブ
for ext in zip rar tar gz 7z dmg pkg; do
    for f in "$DESKTOP"/*.$ext "$DESKTOP"/*.${ext^^}; do
        [ -f "$f" ] && mv "$f" "$DESKTOP/📦 アーカイブ/" && echo "アーカイブ: $(basename "$f")"
    done
done

# アプリ
for f in "$DESKTOP"/*.app; do
    [ -d "$f" ] && mv "$f" "$DESKTOP/💻 アプリ/" && echo "アプリ: $(basename "$f")"
done

# 空フォルダを削除
for dir in "$DESKTOP/📸 画像" "$DESKTOP/📄 書類" "$DESKTOP/🎬 動画" "$DESKTOP/🎵 音楽" "$DESKTOP/📦 アーカイブ" "$DESKTOP/📷 スクリーンショット" "$DESKTOP/💻 アプリ" "$DESKTOP/📁 その他"; do
    [ -d "$dir" ] && [ -z "$(ls -A "$dir")" ] && rmdir "$dir"
done

echo ""
echo "✅ 整理完了！"
