#!/bin/sh
# Синхронизация метаданных из .user.js в .meta.js

USER_FILE="4pda-dark-mode.user.js"
META_FILE="4pda-dark-mode.meta.js"

# Проверяем существование
if [ ! -f "$USER_FILE" ]; then
    exit 0
fi

# Проверяем изменился ли .user.js
if [ -f "$META_FILE" ]; then
    NEW_HASH=$(sed -n '/^\/\/ ==UserScript==$/,/^\/\/ ==\/UserScript==$/p' "$USER_FILE" | md5sum | cut -d' ' -f1)
    OLD_HASH=$(sed -n '/^\/\/ ==UserScript==$/,/^\/\/ ==\/UserScript==$/p' "$META_FILE" | md5sum | cut -d' ' -f1)
    
    if [ "$NEW_HASH" = "$OLD_HASH" ]; then
        exit 0
    fi
fi

# Копируем заголовок
sed -n '/^\/\/ ==UserScript==$/,/^\/\/ ==\/UserScript==$/p' "$USER_FILE" > "$META_FILE"

echo "✓ Синхронизировано: $META_FILE"
grep "@version" "$META_FILE"
