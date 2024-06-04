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

const getUsers = (req, res) => {
  const sql = `SELECT * FROM userView`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(result);
  });
};

const deleteUser = (req, res) => {
  const { userId } = req.params;
  const sql = `DELETE FROM users WHERE userId = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  const sql = `SELECT * FROM userView WHERE userId = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(result[0]);
  });
};

const editUser = (req, res) => {
  const { userId } = req.params;
  const { username, password, fullname, phone, position } = req.body;
  const sql = `UPDATE users SET usrname = ?, usrpass = ?, fullName = ?, phoneNum = ?, roleId = ? WHERE userId = ?`;
  db.query(sql, [username, password, fullname, phone, position, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
};


module.exports = { addUser, getUsers, deleteUser, editUser, getUserById };
