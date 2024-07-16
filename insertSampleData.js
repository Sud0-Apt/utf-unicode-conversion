const mysql = require('mysql2/promise');
// const dbConfig = require('../config/dbConfig');
const dbConfig = {
    host: 'localhost',
    user: 'username',           // Replace with your MySQL username
    password: 'StrongPassw0rd!', // Replace with your MySQL password
    database: 'original_db',
};


(async function() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const sampleText = 'శుభోదయం';

        // Insert sample data
        await connection.execute('INSERT INTO text_data (text) VALUES (?)', [sampleText]);

        console.log('Sample data inserted successfully.');

        await connection.end();
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
