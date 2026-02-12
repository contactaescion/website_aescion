const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const rows = db.prepare('SELECT id, title, public_url, s3_key FROM gallery_images LIMIT 3').all();
console.log(JSON.stringify(rows, null, 2));
