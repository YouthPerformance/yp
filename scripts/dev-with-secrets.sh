#!/bin/bash
# Run dev server with 1Password secrets injected
# Usage: ./scripts/dev-with-secrets.sh [app-filter]
# Example: ./scripts/dev-with-secrets.sh @yp/web-academy

set -e

if ! command -v op &> /dev/null; then
    echo "Error: 1Password CLI not installed. Run: brew install 1password-cli"
    exit 1
fi

if [ -n "$1" ]; then
    echo "Starting $1 with 1Password secrets..."
    op run --env-file=.env.1password -- pnpm turbo run dev --filter="$1"
else
    echo "Starting all apps with 1Password secrets..."
    op run --env-file=.env.1password -- pnpm dev
fi
