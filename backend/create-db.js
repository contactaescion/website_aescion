const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || 'root',
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE || 'aescion_db'}\`;`);
        console.log('Database created or already exists.');
        await connection.end();
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }
}

createDb();
