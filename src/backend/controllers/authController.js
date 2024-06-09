const jwt = require('jsonwebtoken');
const db = require('../db/db');

const login = (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT userId, usrname, fullName, roleId FROM users WHERE usrname = ? AND usrpass = ?`;
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result.length > 0) {
      const user = result[0];
      const token = jwt.sign(
        { userId: user.userId, username: user.usrname, role: user.roleId },
        'your_secret_key', // Ganti dengan secret key yang aman
        { expiresIn: '1h' } // Token akan kadaluarsa dalam 1 jam
      );

      res.json({
        token: token,
        role: user.roleId,
        username: user.usrname,
        fullname: user.fullName,
      });
    } else {
      res.status(401).json({ message: 'Username or password is incorrect' });
    }
  });
};

module.exports = { login };