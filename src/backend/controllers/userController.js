const db = require('../db/db');

const addUser = (req, res) => {
  const { username, password, fullname, phone, position } = req.body;
  const sql = `CALL addUser(?, ?, ?, ?, ?)`;
  db.query(sql, [username, password, fullname, phone, position], (err, result) => {
    if (err) {
      console.error('Error executing stored procedure:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
};

module.exports = { addUser };
