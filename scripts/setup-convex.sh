#!/bin/bash
# Setup script for YouthPerformance Convex backend

set -e

echo "🏀 YouthPerformance Convex Setup"
echo "================================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if Convex is already set up
if [ -z "$CONVEX_DEPLOYMENT" ]; then
    echo ""
    echo "🔧 Setting up Convex..."
    echo "   This will open a browser to authenticate with Convex."
    echo ""
    npx convex dev --once
else
    echo "✅ Convex already configured"
fi

# Push schema
echo ""
echo "📋 Pushing schema to Convex..."
npx convex dev --once

# Seed authors
echo ""
echo "👤 Seeding authors (James Scott & Adam Harrington)..."
npx convex run authors:seedJamesScott
npx convex run authors:seedAdamHarrington

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'pnpm dev:convex' to start the Convex development server"
echo "  2. Visit https://dashboard.convex.dev to see your data"
echo "  3. Start building the Next.js frontend"
echo ""
