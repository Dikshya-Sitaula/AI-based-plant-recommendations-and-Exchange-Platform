const path = require('path');
const dbPath = path.join(process.cwd(), 'Backend', 'db.js');
console.log('Requiring DB from:', dbPath);
const db = require(dbPath);

async function checkSchema() {
    try {
        const [rows] = await db.execute('DESCRIBE users');
        const fields = rows.map(r => r.Field);
        console.log('Users table columns:', fields);
        
        if (!fields.includes('profile_image')) {
            console.log('Adding profile_image column...');
            await db.execute('ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL');
            console.log('Column added successfully.');
        } else {
            console.log('profile_image column already exists.');
        }
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
