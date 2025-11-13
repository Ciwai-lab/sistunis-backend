// db/index.js
const { Pool, types } = require('pg');
require('dotenv').config();

// Convert numeric to float automatically
// 1700 is OID for numeric in Postgres
types.setTypeParser(1700, val => (val === null ? null : parseFloat(val)));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // optional: ssl settings for production
});

module.exports = pool;
