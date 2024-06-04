const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'yogaa',
  password: 'bajaringan',
  database: 'tb_prak_db'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Database connected!');
});

module.exports = db;
