#!/bin/bash

# PostgreSQL Database Setup Script for QeeBoard
# Usage: ./setup-database.sh (sudo may be required)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗄️  QeeBoard PostgreSQL Database Setup${NC}\n"

# Database configuration
DB_NAME="qeeboard"
DB_USER="qeeboard"
DB_PASSWORD="qeeboard-123"

echo -e "\n${YELLOW}Creating database and user...${NC}"

# Try different connection methods
SUCCESS=false

# Method 1: Try with postgres user (if exists)
if id "postgres" &>/dev/null; then
    echo -e "${YELLOW}Trying with postgres user...${NC}"
    sudo -u postgres psql <<EOF 2>/dev/null && SUCCESS=true || true
-- Create database (if not exists)
SELECT 'CREATE DATABASE ${DB_NAME}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

-- Create user (if not exists)
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '${DB_USER}') THEN
      CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   ELSE
      ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Connect to database and grant schema privileges
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF
fi

# Method 2: Try direct psql as root (if postgres user method failed)
if [ "$SUCCESS" = false ] && [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}Trying direct psql as root...${NC}"
    psql -U postgres <<EOF 2>/dev/null && SUCCESS=true || true
-- Create database (if not exists)
SELECT 'CREATE DATABASE ${DB_NAME}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

-- Create user (if not exists)
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '${DB_USER}') THEN
      CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   ELSE
      ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Connect to database and grant schema privileges
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF
fi

# Method 3: Try with current user (if both failed)
if [ "$SUCCESS" = false ]; then
    echo -e "${YELLOW}Trying with current user...${NC}"
    psql <<EOF 2>/dev/null && SUCCESS=true || true
-- Create database (if not exists)
SELECT 'CREATE DATABASE ${DB_NAME}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

-- Create user (if not exists)
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '${DB_USER}') THEN
      CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   ELSE
      ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
   END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Connect to database and grant schema privileges
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF
fi

# Method 4: Try with PGPASSWORD environment variable
if [ "$SUCCESS" = false ]; then
    echo -e "${YELLOW}Trying with PGPASSWORD...${NC}"
    export PGPASSWORD="${DB_PASSWORD}"
    psql -U ${DB_USER} -d ${DB_NAME} <<EOF 2>/dev/null && SUCCESS=true || true
-- Grant privileges (database and user already exist)
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF
    unset PGPASSWORD
fi

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}✓${NC} Database '${DB_NAME}' configured successfully"
    echo -e "${GREEN}✓${NC} User '${DB_USER}' configured successfully"
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
    echo -e "${RED}✗${NC} Could not connect to PostgreSQL!"
    echo ""
    echo -e "${YELLOW}Since you've already created the database manually, you can:${NC}"
    echo "1. Skip this script and use the connection string directly:"
    echo "   postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
    echo ""
    echo "2. Or manually grant privileges by connecting to PostgreSQL:"
    echo "   psql -U postgres -d ${DB_NAME}"
    echo "   Then run:"
    echo "   GRANT ALL ON SCHEMA public TO ${DB_USER};"
    echo "   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};"
    echo "   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};"
    exit 1
fi
