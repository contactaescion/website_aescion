const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const emailToCheck = 'contact.aescion@gmail.com';

db.serialize(() => {
    db.get("SELECT * FROM users WHERE email = ?", [emailToCheck], (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            if (row) {
                console.log(`User found: ID=${row.id}, Email=${row.email}, Role=${row.role}`);
            } else {
                console.log('User NOT found.');
            }
        }
    });

    // List all users just in case
    db.all("SELECT id, email, role FROM users", [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\nAll Users in DB:");
        rows.forEach((row) => {
            console.log(`${row.id}: ${row.email} (${row.role})`);
        });
    });
});

db.close();
