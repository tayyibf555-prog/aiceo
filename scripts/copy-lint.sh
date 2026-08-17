#!/usr/bin/env bash
# Copy gate from docs/brief.md §5: banned words + em-dash, checked against
# the single source of copy. Exits 1 with the offending lines if any hit.
set -u
TARGET="${1:-src/content/site.ts}"

PATTERN='\bhelps?\b|\badopt|\bscale\b|\bleverage|automations?|AI-powered|digital transformation|workforce|empire|unlock|10x|co-pilot|AI Operating System|—'

if grep -nEi "$PATTERN" "$TARGET"; then
  echo "COPY_VIOLATIONS_FOUND in $TARGET" >&2
  exit 1
fi
echo "COPY_CLEAN"
