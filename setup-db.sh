#!/bin/bash

# P01NT Database Setup Script
# This script sets up the PostgreSQL database for development

set -e

echo "🏆 P01NT Database Setup"
echo "======================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql@14"
    echo "  Ubuntu: sudo apt-get install postgresql"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    brew services start postgresql@14 2>/dev/null || sudo service postgresql start 2>/dev/null || true
    sleep 2
fi

# Database configuration
DB_NAME="p01nt"
DB_USER="${PGUSER:-postgres}"

echo -e "\n${YELLOW}Creating database '${DB_NAME}'...${NC}"

# Create database if it doesn't exist
if psql -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo -e "${GREEN}Database '${DB_NAME}' already exists${NC}"
else
    createdb -U "$DB_USER" "$DB_NAME"
    echo -e "${GREEN}Database '${DB_NAME}' created successfully${NC}"
fi

echo -e "\n${YELLOW}Running Prisma migrations...${NC}"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

echo -e "\n${GREEN}✅ Database setup complete!${NC}"
echo ""
echo "You can now run:"
echo "  npm run dev        - Start the development server"
echo "  npm run db:studio  - Open Prisma Studio to view data"
echo ""
