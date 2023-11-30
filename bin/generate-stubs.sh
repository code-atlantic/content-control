#!/usr/bin/env bash

HEADER=$'/**\n * Generated stub declarations for Content Control.\n * @see https://contentcontrolplugin.com/\n * @see https://github.com/php-stubs/content-control-stubs\n */'

FILE="./bin/stubs/content-control.php"
# FILE="../content-control-pro/bin/stubs/content-control.stub"

set -e

if [ ! -f "$FILE" ]; then
    echo "File $FILE does not exist."
    exit 1
fi

echo "Generating stubs for Content Control..."

# Exclude globals.
"generate-stubs" \
    --include-inaccessible-class-nodes \
    --force \
    # --finder=bin/generate-stubs.php \
    --header="$HEADER" \
    --out="$FILE"
    ./classes/ ./inc/ ./content-control.php ./uninstall.php
