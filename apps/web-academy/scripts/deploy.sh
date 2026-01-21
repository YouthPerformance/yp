#!/bin/bash
set -e

# Deploy web-academy to Cloudflare Pages
# Usage: ./scripts/deploy.sh [preview|production]

ENV="${1:-preview}"
PROJECT_NAME="web-academy"

echo "Building for Cloudflare Pages..."
npm run build:cf

echo "Deploying to $ENV..."
if [ "$ENV" == "production" ]; then
    npx wrangler pages deploy .open-next/assets --project-name=$PROJECT_NAME --branch=production
else
    npx wrangler pages deploy .open-next/assets --project-name=$PROJECT_NAME
fi

echo "Deploy complete!"
