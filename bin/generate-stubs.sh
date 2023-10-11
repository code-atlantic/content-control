#!/usr/bin/env bash

HEADER=$'/**\n * Generated stub declarations for Content Control.\n * @see https://contentcontrolplugin.com/\n * @see https://github.com/php-stubs/content-control-stubs\n */'

FILE="./stubs.php"

set -e

test -f "$FILE"

# Exclude globals.
"vendor/bin/generate-stubs" \
    --include-inaccessible-class-nodes \
    --force \
    --finder=bin/generate-stubs.php \
    --header="$HEADER" \
    --functions \
    --classes \
    --interfaces \
    --traits \
    --out="$FILE"

