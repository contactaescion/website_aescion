const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Check Courses
    db.all("SELECT id, title FROM courses", [], (err, rows) => {
        if (err) console.error("Error fetching courses:", err);
        else console.log(`\nCourses Found (${rows.length}):`, rows);
    });

    // Check Gallery
    db.all("SELECT id, title FROM gallery", [], (err, rows) => {
        if (err) console.error("Error fetching gallery:", err);
        else console.log(`\nGallery Images Found (${rows.length}):`, rows);
    });

    // Check Popups
    db.all("SELECT id, title FROM popups", [], (err, rows) => {
        if (err) console.error("Error fetching popups:", err);
        else console.log(`\nPopups Found (${rows.length}):`, rows);
    });
});

// db.close() is called implicitly when serialization finishes? No, better close it explicitly after a timeout or use promises. 
// For this simple script, we can just let it drain or use a timeout.
setTimeout(() => db.close(), 1000);
