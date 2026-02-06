const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const targetEmail = 'contact.aescion@gmail.com';
// Typo handling: user might have typed it wrong in DB previously or we want to fix any 'admin@aescion.com'
const oldEmails = ['admin@aescion.com', 'contact.aescio@gmail.com'];

db.serialize(() => {
    // 1. Check if target exists
    db.get("SELECT * FROM users WHERE email = ?", [targetEmail], (err, row) => {
        if (row) {
            console.log(`\n✅ Success: Admin user '${targetEmail}' already exists (ID: ${row.id}).`);
        } else {
            console.log(`\n⚠️ Target user '${targetEmail}' NOT found. Checking for old users to rename...`);

            // 2. Try to update old email to new email
            db.run(`UPDATE users SET email = ? WHERE email IN ('${oldEmails.join("','")}') OR role = 'SUPER_ADMIN'`, [targetEmail], function (err) {
                if (err) console.error(err);
                if (this.changes > 0) {
                    console.log(`\n✅ Fixed! Updated ${this.changes} user(s) to '${targetEmail}'.`);
                } else {
                    console.log("\n❌ Could not find any admin user to update. You might need to run 'npm run seed'.");
                }
            });
        }
    });

    // 3. List all users for verification
    db.all("SELECT id, email, role FROM users", [], (err, rows) => {
        console.log("\n--- Current Users List ---");
        rows.forEach(r => console.log(`${r.id}: ${r.email} [${r.role}]`));
        console.log("--------------------------\n");
    });
});

db.close();
