const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const galleryCount = db.prepare('SELECT count(*) as c FROM gallery_images').get();
console.log(`Gallery Images: ${galleryCount.c}`);

const usersCount = db.prepare('SELECT count(*) as c FROM users').get();
console.log(`Users: ${usersCount.c}`);

const roles = db.prepare('SELECT distinct role FROM users').all();
console.log('Roles found:', roles);
