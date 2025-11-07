#!/bin/bash

# PostgreSQL Database Setup Script for QeeBoard
# Usage: sudo ./setup-database.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗄️  QeeBoard PostgreSQL Database Setup${NC}\n"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}✗${NC} Please run with sudo: ${YELLOW}sudo ./setup-database.sh${NC}"
    exit 1
fi

# Database configuration (değiştirebilirsiniz)
DB_NAME="qeeboard_db"
DB_USER="qeeboard_user"
DB_PASSWORD=""

# Password input
echo -e "${YELLOW}Enter password for database user '${DB_USER}':${NC}"
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}✗${NC} Password cannot be empty!"
    exit 1
fi

echo -e "\n${YELLOW}Creating database and user...${NC}"

# Create database and user
sudo -u postgres psql <<EOF
-- Create database
CREATE DATABASE ${DB_NAME};

-- Create user
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Connect to database and grant schema privileges
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Database '${DB_NAME}' created successfully"
    echo -e "${GREEN}✓${NC} User '${DB_USER}' created successfully"
    echo ""
    echo -e "${GREEN}Connection String:${NC}"
    echo -e "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
    echo ""
    echo -e "${YELLOW}⚠️  Save this connection string! You'll need it for backend/.env file${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Add this connection string to backend/.env file"
    echo "2. Run: cd backend && npm run db:deploy"
else
    echo -e "${RED}✗${NC} Database creation failed!"
    exit 1
fi

