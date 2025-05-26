#!/bin/bash
set -e

# This script runs when the PostgreSQL container starts for the first time.
# It creates the database and runs any SQL files in the /docker-entrypoint-initdb.d/ directory.

echo "Initializing database..."

# Create additional databases if needed
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
#     CREATE DATABASE your_extra_db;
#     GRANT ALL PRIVILEGES ON DATABASE your_extra_db TO "$POSTGRES_USER";
# EOSQL

echo "Database initialization complete!"
