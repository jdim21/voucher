import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'solglyphsdb.c0b9dir9sszq.us-east-2.rds.amazonaws.com',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
    port: 5432
});
