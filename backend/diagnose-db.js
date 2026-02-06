const mysql = require('mysql2/promise');

const passwords = [
    '',             // Empty
    'root',         // Default
    'password',     // Common
    '1234',         // Simple
    '123456',       // Simple
    'admin',        // Common
    'admin123'      // Common
];

async function testConnection() {
    console.log('Diagnosing MySQL connection...');

    for (const password of passwords) {
        try {
            console.log(`Trying root user with password: "${password}"...`);
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: password,
                port: 3306
            });
            console.log(`\n✅ SUCCESS! Connected with password: "${password}"`);
            console.log('Please update your .env file with this password.');
            await connection.end();
            return;
        } catch (err) {
            // Continue completely silent on failure unless it's not an auth error
            if (err.code !== 'ER_ACCESS_DENIED_ERROR' && err.code !== 'ER_NOT_SUPPORTED_AUTH_MODE') {
                console.log(`   ❌ Connection failed with non-auth error: ${err.code}`);
            }
        }
    }

    console.log('\n❌ Failed to connect with common default passwords.');
    console.log('Recommendation: Switch to SQLite for local development to bypass this issue.');
}

testConnection();
