const mysql = require('mysql2/promise');
const iconv = require('iconv-lite');
const dbConfig = require('../config/dbConfig');
const dbConfigOriginal = {
    host: 'localhost',
    user: 'username',           // Replace with your MySQL username
    password: 'StrongPassw0rd!', // Replace with your MySQL password
    database: 'original_db',
};

const dbConfigUtf = {
    host: 'localhost',
    user: 'username',           // Replace with your MySQL username
    password: 'StrongPassw0rd!', // Replace with your MySQL password
    database: 'utf_db',
};


(async function() {
    try {
        const connectionOriginal = await mysql.createConnection(dbConfigOriginal);
        const connectionUtf = await mysql.createConnection(dbConfigUtf);

        // Function to retrieve data from original_db
        async function retrieveOriginalData() {
            const [rows] = await connectionOriginal.execute('SELECT text FROM text_data');
            return rows;
        }

        // Function to insert data into utf_db
        async function insertUtfData(text) {
            await connectionUtf.execute('INSERT INTO text_data (text) VALUES (?)', [text]);
        }

        // Function to retrieve data from utf_db
        async function retrieveUtfData() {
            const [rows] = await connectionUtf.execute('SELECT text FROM text_data');
            return rows;
        }

        // Retrieve the text from original_db
        const originalData = await retrieveOriginalData();
        
        for (const row of originalData) {
            const retrievedText = row.text;

            // Convert the retrieved text from Unicode to UTF-8 bytes and back to a string
            const utf8Buffer = iconv.encode(retrievedText, 'utf8');
            const utf8Text = iconv.decode(utf8Buffer, 'utf8');

            // Insert the converted UTF-8 text into utf_db
            await insertUtfData(utf8Text);
        }

        // Retrieve and display data from utf_db
        const utfData = await retrieveUtfData();
        console.log('Data stored in utf_db:');
        for (const row of utfData) {
            console.log(row.text);
        }

        await connectionOriginal.end();
        await connectionUtf.end();

        console.log('Text data successfully transferred and displayed from utf_db');
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();