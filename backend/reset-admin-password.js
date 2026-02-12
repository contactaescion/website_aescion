const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const email = 'contact.aescion@gmail.com';
const newPassword = 'AESCION@123';
const saltRounds = 10;

console.log(`Resetting password for ${email}...`);

bcrypt.hash(newPassword, saltRounds, function (err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }

    db.serialize(() => {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return;
            }

            if (!row) {
                console.error(`User ${email} not found!`);
                return;
            }

            db.run("UPDATE users SET password = ? WHERE email = ?", [hash, email], function (err) {
                if (err) {
                    console.error('Error updating password:', err);
                } else {
                    console.log(`Password updated successfully for ${email}`);
                    console.log(`New Password: ${newPassword}`);
                }
                db.close();
            });
        });
    });
});
