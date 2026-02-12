const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'database.sqlite');
const uploadsDir = path.join(__dirname, 'uploads');
const API_URL = 'http://localhost:3000';

const db = new Database(dbPath/*, { verbose: console.log }*/);

async function run() {
    console.log('--- Fixing Database v2 ---');

    // 1. Clear Gallery with robust handling
    console.log('Clearing gallery_images table...');
    try {
        // Use a transaction for atomic cleanup
        const deleteTx = db.transaction(() => {
            db.prepare('DELETE FROM gallery_images').run();
            try {
                db.prepare("DELETE FROM sqlite_sequence WHERE name='gallery_images'").run();
            } catch (e) { /* ignore */ }
        });
        deleteTx();
        console.log('Gallery cleared successfully.');
    } catch (err) {
        console.error('Failed to clear gallery:', err.message);
        // If delete fails, imports will likely duplicate, so we should stop or try deleting individually
        // Let's try iterating and deleting if bulk fails
        const images = db.prepare('SELECT id FROM gallery_images').all();
        console.log(`Fallback: Deleting ${images.length} images individually...`);
        const delStmt = db.prepare('DELETE FROM gallery_images WHERE id = ?');
        images.forEach(img => {
            try { delStmt.run(img.id); } catch (e) { console.error(`Failed to delete ID ${img.id}:`, e.message); }
        });
    }

    // 2. Re-import Images
    const files = [
        { name: 'class.jpeg', title: 'Modern Classroom', category: 'Classroom' },
        { name: 'class1.jpeg', title: 'Interactive Learning', category: 'Classroom' },
        { name: 'event.jpeg', title: 'Campus Event', category: 'Events' },
        { name: 'event1.jpeg', title: 'Student Activities', category: 'Events' },
        { name: 'office.jpeg', title: 'AESCION Office', category: 'Office' },
        { name: 'recruitment.jpeg', title: 'Recruitment Drive', category: 'Events' }
    ];

    console.log('Re-importing unique images...');
    const insertStmt = db.prepare(`
        INSERT INTO gallery_images (title, category, description, s3_key, public_url, thumb_url, is_featured, created_at)
        VALUES (@title, @category, @description, @s3_key, @public_url, @thumb_url, @is_featured, @created_at)
    `);

    let count = 0;
    // Transaction for imports
    const importTx = db.transaction((filesToImport) => {
        for (const file of filesToImport) {
            const filePath = path.join(uploadsDir, file.name);
            if (fs.existsSync(filePath)) {
                // Double check existence
                const existing = db.prepare('SELECT id FROM gallery_images WHERE s3_key = ?').get(file.name);
                if (!existing) {
                    insertStmt.run({
                        title: file.title,
                        category: file.category,
                        description: `Uploaded image: ${file.title}`,
                        s3_key: file.name,
                        public_url: `${API_URL}/uploads/${file.name}`,
                        thumb_url: `${API_URL}/uploads/${file.name}`,
                        is_featured: 1,
                        created_at: new Date().toISOString()
                    });
                    count++;
                    console.log(`Imported: ${file.name}`);
                } else {
                    console.log(`Skipped duplicate s3_key: ${file.name}`);
                }
            } else {
                console.warn(`File missing: ${file.name}`);
            }
        }
    });

    try {
        importTx(files);
        console.log(`Gallery fixed. ${count} images imported.`);
    } catch (err) {
        console.error('Import transaction failed:', err.message);
    }


    // 3. Fix Admin User
    console.log('Fixing Admin User...');
    const email = 'contact.aescion@gmail.com';
    const password = 'AESCION@123';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = 'super_admin';

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (user) {
            console.log(`Updating existing admin user (ID: ${user.id})...`);
            db.prepare('UPDATE users SET password = ?, role = ? WHERE email = ?')
                .run(hashedPassword, role, email);
        } else {
            console.log('Creating new admin user...');
            db.prepare(`
                INSERT INTO users (email, password, full_name, role, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(email, hashedPassword, 'Admin User', role, new Date().toISOString(), new Date().toISOString());
        }
        console.log('Admin user credentials reset.');
    } catch (err) {
        console.error('Failed to fix admin user:', err.message);
    }

    console.log('--- DONE ---');
}

run().catch(console.error);
