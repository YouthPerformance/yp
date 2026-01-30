#!/bin/bash
# ============================================
# RUN WITH 1PASSWORD SECRETS
# ============================================
# Usage:
#   ./scripts/run-with-secrets.sh machine:parallel
#   ./scripts/run-with-secrets.sh am:report
#   ./scripts/run-with-secrets.sh machine:run --count=50
#
# Requires: 1Password CLI (op) installed and signed in
# ============================================

set -e

# Check if 1Password CLI is installed
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI (op) not found"
    echo "   Install: brew install 1password-cli"
    exit 1
fi

# Check if signed in
if ! op account list &> /dev/null; then
    echo "🔐 1Password sign-in required..."
    eval "$(op signin)"
fi

# Run the command with secrets injected
echo "🔓 Running with 1Password secrets..."
echo "   Command: pnpm $@"
echo ""

op run --env-file=.env.1password -- pnpm "$@"
