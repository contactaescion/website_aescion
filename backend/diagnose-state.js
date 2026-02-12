const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('--- Gallery Images ---');
const images = db.prepare('SELECT id, title, s3_key, category FROM gallery_images').all();
if (images.length === 0) {
    console.log('No images found.');
} else {
    // Group by title to find duplicates
    const titleCounts = {};
    images.forEach(img => {
        titleCounts[img.title] = (titleCounts[img.title] || 0) + 1;
    });

    images.forEach(img => {
        const isDup = titleCounts[img.title] > 1 ? '[DUPLICATE]' : '';
        console.log(`${img.id}: ${img.title} (${img.category}) - ${img.s3_key} ${isDup}`);
    });
}

console.log('\n--- Users ---');
const users = db.prepare('SELECT id, email, role, full_name FROM users').all();
if (users.length === 0) {
    console.log('No users found.');
} else {
    users.forEach(u => {
        console.log(`${u.id}: ${u.email} (${u.role}) - ${u.full_name}`);
    });
}
