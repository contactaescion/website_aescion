
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Cleaning up images from database...');

db.serialize(() => {
    // Clear Gallery Images (Table: gallery_images)
    db.run("DELETE FROM gallery_images", (err) => {
        if (err) console.error("Error clearing gallery:", err);
        else console.log("Gallery table cleared.");
    });

    // Clear Popups (Table: popups)
    db.run("DELETE FROM popups", (err) => {
        if (err) console.error("Error clearing popups:", err);
        else console.log("Popup table cleared.");
    });
});

db.close(() => {
    console.log('Database cleanup complete.');
});
