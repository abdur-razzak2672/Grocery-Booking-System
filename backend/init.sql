-- Create database if it doesn't exist
-- Note: The postgres image handles DB creation via POSTGRES_DB env var, 
-- but this file can be used for extra initialization.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Additional setup if needed
