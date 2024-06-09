const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');  // Menggunakan mysql2

// Konfigurasi koneksi ke database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yogaa',
    password: 'bajaringan',
    database: 'tb_prak_db'
});

connection.connect(err => {
    if (err) {
        return console.error('error connecting: ' + err.stack);
    }
    console.log('connected as id ' + connection.threadId);
});

const queue = [];
let processing = false;

async function processQueue() {
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
        const { row, index } = queue.shift();  // Mengambil item dari queue
        await insertData(row, index);
    }

    processing = false;
    // Memindahkan connection.end() ke sini untuk memastikan semua operasi selesai
    console.log('All data has been processed and the connection will be closed.');
    connection.end();
}

function addToQueue(row, index) {
    queue.push({ row, index });
    processQueue();
}

async function insertData(row, index) {
    const query = `
        INSERT INTO MedicineData (medicineName, brand, medicinePrice, medicineUnit, stock, expirationDate)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
        row.medicineName,
        row.brand,
        parseFloat(row.medicinePrice),
        row.unit,
        parseInt(row.stock),
        row.expirationDate
    ];

    try {
        const [results] = await connection.promise().query(query, values);
        console.log(`Data id ke-${index + 1} berhasil ditambahkan (Row ID: ${results.insertId})`);
    } catch (error) {
        console.error('Error inserting data:', error.message);
    }
}

let index = 0;  // Inisialisasi indeks baris

fs.createReadStream('src/database/dataset/APOTEK_normalized.csv')
    .pipe(csv())
    .on('data', (row) => {
        addToQueue(row, index);
        index++;  // Inkremen indeks untuk setiap baris yang diproses
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        processQueue();  // Memastikan processQueue dipanggil di sini untuk menangani item terakhir
    });