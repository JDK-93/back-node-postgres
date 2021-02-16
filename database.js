const { Pool } = require('pg');

console.log(process.env.USER)

const pool = new Pool({
    user: "user_name",
    host: process.env.HOST,
    password:"db_pass",
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

module.exports = pool
