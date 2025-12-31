#!/bin/bash

# Peterson Academy Clone - Development Environment Setup
# This script sets up and starts the development environment

set -e  # Exit on error

echo "=================================================="
echo "  Peterson Academy Clone - Development Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "${BLUE}Step 1: Installing frontend dependencies...${NC}"
pnpm install

echo ""
echo -e "${BLUE}Step 2: Setting up backend...${NC}"

# Create server directory if it doesn't exist
if [ ! -d "server" ]; then
    mkdir -p server
    echo "Created server directory"
fi

# Install backend dependencies
cd server
if [ ! -f "package.json" ]; then
    echo "Initializing backend package.json..."
    cat > package.json << 'EOF'
{
  "name": "peterson-academy-server",
  "version": "1.0.0",
  "description": "Peterson Academy Clone - Backend Server",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "seed": "node seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "better-sqlite3": "^9.2.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1"
  }
}
EOF
fi

echo "Installing backend dependencies..."
pnpm install

cd ..

echo ""
echo -e "${BLUE}Step 3: Creating required directories...${NC}"
mkdir -p public/videos
mkdir -p public/images
mkdir -p server/db
echo "Created public/videos, public/images, and server/db directories"

echo ""
echo -e "${BLUE}Step 4: Setting up environment variables...${NC}"
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Frontend
VITE_API_URL=http://localhost:3001/api

# Backend (copy to server/.env)
PORT=3001
JWT_SECRET=peterson-academy-dev-secret-change-in-production
NODE_ENV=development
EOF
    echo "Created .env file"
fi

if [ ! -f "server/.env" ]; then
    cat > server/.env << 'EOF'
PORT=3001
JWT_SECRET=peterson-academy-dev-secret-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF
    echo "Created server/.env file"
fi

echo ""
echo -e "${GREEN}=================================================="
echo "  Setup Complete!"
echo "==================================================${NC}"
echo ""
echo -e "${BLUE}To start development:${NC}"
echo ""
echo "  Terminal 1 (Frontend):"
echo "    pnpm dev"
echo ""
echo "  Terminal 2 (Backend):"
echo "    cd server && pnpm dev"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:3001/api"
echo ""
echo -e "${YELLOW}First time setup:${NC}"
echo "  Run 'cd server && pnpm seed' to populate the database"
echo ""
