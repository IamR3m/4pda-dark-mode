#!/bin/bash

# Path to your userscript file
USER_JS_FILE="4pda-dark-mode.user.js"
META_JS_FILE="4pda-dark-mode.meta.js"

# Extract the current version
CURRENT_VERSION=$(grep -oP '@version\s+\K\d+\.\d+\.\d+' "$USER_JS_FILE")

# Split version into major, minor, and patch
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Check the argument to determine which version part to increment
case "$1" in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch|*)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Replace the version in the file
sed -i "s/\(@version\s*\)$CURRENT_VERSION/\1$NEW_VERSION/" "$USER_JS_FILE"

HEADER=$(awk '/^\/\/ ==UserScript==/,/^\/\/ ==\/UserScript==/' $USER_JS_FILE)
echo -e "$HEADER" > $META_JS_FILE

# Add the changes to the staging area
git add "$USER_JS_FILE"
git add "$META_JS_FILE"
