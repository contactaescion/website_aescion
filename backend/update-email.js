const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const newEmail = 'contact.aescion@gmail.com';
const oldEmail = 'admin@aescion.com';

db.serialize(() => {
    db.run("UPDATE users SET email = ? WHERE email = ?", [newEmail, oldEmail], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);

        if (this.changes === 0) {
            // Maybe it's already updated or ID is different?
            db.run("UPDATE users SET email = ? WHERE id = 1", [newEmail], function (err) {
                if (err) console.error(err);
                console.log(`Tried updating ID 1. Changes: ${this.changes}`);
            });
        }
    });

    db.all("SELECT id, email FROM users", [], (err, rows) => {
        if (err) throw err;
        console.log("Current Users:");
        rows.forEach((row) => {
            console.log(`${row.id}: ${row.email}`);
        });
    });
});

db.close();
