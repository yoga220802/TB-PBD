const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE usrname = ? AND usrpass = ?`;
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result.length > 0) {
      res.json({ token: 'your_generated_token_here', role: result[0].roleId });
    } else {
      res.status(401).json({ message: 'Username or password is incorrect' });
    }
  });
});
