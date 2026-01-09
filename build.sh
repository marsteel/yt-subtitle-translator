#!/bin/bash

# Extract version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')

# Output filename
OUTPUT_FILE="yt-subtitle-translator-v${VERSION}.zip"

echo "Building extension package..."
echo "Version: $VERSION"
echo "Output: $OUTPUT_FILE"

# Remove old zip file if exists
if [ -f "$OUTPUT_FILE" ]; then
    echo "Removing existing $OUTPUT_FILE"
    rm "$OUTPUT_FILE"
fi

# Create zip file excluding unnecessary files
zip -r "$OUTPUT_FILE" \
    manifest.json \
    popup.html \
    popup.js \
    background.js \
    content.js \
    _locales/ \
    icons/ \
    -x "*.DS_Store" \
    -x "__MACOSX/*" \
    -x ".git/*" \
    -x ".gitignore" \
    -x "*.sh" \
    -x "docs/*" \
    -x "*.md" \
    -x "node_modules/*"

echo ""
echo "✅ Package created successfully: $OUTPUT_FILE"
echo "File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "Ready to upload to Chrome Web Store and Edge Add-ons!"
