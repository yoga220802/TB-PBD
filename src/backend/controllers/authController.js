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
      res.json({
        token: 'your_generated_token_here',
        role: result[0].roleId,
        username: result[0].usrname,
        fullname: result[0].fullName,
      });
    } else {
      res.status(401).json({ message: 'Username or password is incorrect' });
    }
  });
};

module.exports = { login };
