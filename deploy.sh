#!/bin/bash

# QeeBoard Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting QeeBoard deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Note: Script can be run as root or regular user
# Some commands may require sudo for permissions

# Project directory
PROJECT_DIR="/home/qeeboard/htdocs/www.qeeboard.com"
cd "$PROJECT_DIR" || exit 1

echo -e "${GREEN}✓${NC} Project directory: $PROJECT_DIR"

# Backend deployment
echo -e "\n${YELLOW}📦 Building backend...${NC}"
cd "$PROJECT_DIR/backend"

if [ ! -f ".env" ]; then
    echo -e "${RED}✗${NC} Backend .env file not found!"
    echo "Please create .env file from .env.example"
    exit 1
fi

npm install
npm run db:generate
npm run db:deploy
npm run build

echo -e "${GREEN}✓${NC} Backend built successfully"

# Frontend deployment
echo -e "\n${YELLOW}📦 Building frontend...${NC}"
cd "$PROJECT_DIR/frontend"

# .env is optional for frontend
npm install
npm run build

echo -e "${GREEN}✓${NC} Frontend built successfully"

# Designer deployment
echo -e "\n${YELLOW}📦 Building designer...${NC}"
cd "$PROJECT_DIR/designer"

# .env is optional for designer
npm install
npm run build

echo -e "${GREEN}✓${NC} Designer built successfully"

# Restart PM2
echo -e "\n${YELLOW}🔄 Restarting backend...${NC}"
pm2 restart qeeboard-backend || pm2 start ecosystem.config.js

echo -e "${GREEN}✓${NC} Backend restarted"

# Reload Nginx
echo -e "\n${YELLOW}🔄 Reloading Nginx...${NC}"
if [ "$EUID" -eq 0 ]; then
    nginx -t && systemctl reload nginx
else
    sudo nginx -t && sudo systemctl reload nginx
fi

echo -e "${GREEN}✓${NC} Nginx reloaded"

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"

