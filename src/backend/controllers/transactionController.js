const db = require('../db/db');

// Menampilkan semua transaksi
const listTransactions = (req, res) => {
  const sql = 'SELECT * FROM TransactionInfo';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(result);
  });
};

const getTransactionDetails = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM DetailedTransactionView WHERE transactionID = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching detailed transaction:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(results);
  });
};

// Menambahkan detail transaksi
const addTransactionDetail = (req, res) => {
  const { transactionID, medicineID, quantity, totalPrice } = req.body;

  // Query untuk menambahkan detail transaksi
  const sqlInsertDetail = 'INSERT INTO TransactionDetail (transactionID, medicineID, quantity, totalPrice) VALUES (?, ?, ?, ?)';
  
  // Query untuk mengurangi stok
  const sqlUpdateStock = 'UPDATE Medicinedata SET stock = stock - ? WHERE medicineID = ?';

  db.query(sqlInsertDetail, [transactionID, medicineID, quantity, totalPrice], (err, result) => {
    if (err) {
      console.error('Error adding transaction detail:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Jika detail transaksi berhasil ditambahkan, kurangi stok
    db.query(sqlUpdateStock, [quantity, medicineID], (err, updateResult) => {
      if (err) {
        console.error('Error updating stock:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'Transaction detail added successfully and stock updated' });
    });
  });
};

// Memperbarui transaksi yang sudah ada
const createTransaction = (req, res) => {
  const { transactionID, totalHarga, bayar, kembalian, namaPembeli, apoteker } = req.body;

  // Ambil userID dari view berdasarkan nama apoteker
  const userQuery = `SELECT userId FROM userView WHERE fullName = ?`;
  db.query(userQuery, [apoteker], (err, userResult) => {
    if (err) {
      console.error('Error fetching user ID:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userID = userResult[0].userId;

    // Update transaksi yang sudah ada
    const sql = 'UPDATE TransactionInfo SET totalAmount = ?, payment = ?, paymentChange = ?, buyerName = ?, userID = ? WHERE transactionID = ?';
    db.query(sql, [totalHarga, bayar, kembalian, namaPembeli, userID, transactionID], (err, result) => {
      if (err) {
        console.error('Error updating transaction:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json({ message: 'Transaction updated successfully', transactionID });
    });
  });
};

// Menghasilkan transactionID baru dan memperbarui tanggal transaksi di TransactionInfo
const generateTransactionID = (req, res) => {
  console.log("Received tanggalTransaksi:", req.body.tanggalTransaksi);
  const { tanggalTransaksi } = req.body;
  const orderDateTime = new Date(tanggalTransaksi);

  if (isNaN(orderDateTime.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  const formattedDateTime = orderDateTime.toISOString().slice(0, 19).replace('T', ' ');

  const transactionIDQuery = `SELECT generate_transaction_id('${formattedDateTime}') AS transactionID;`;
  db.query(transactionIDQuery, (err, result) => {
    if (err) {
      console.error('Error generating transaction ID:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const transactionID = result[0].transactionID;

    // Memperbarui tanggalTransaksi di TransactionInfo dengan transactionID yang baru dibuat
    const updateTransactionInfo = `INSERT INTO TransactionInfo (transactionID, orderDateTime) VALUES (?, ?);`;
    db.query(updateTransactionInfo, [transactionID, formattedDateTime], (err, updateResult) => {
      if (err) {
        console.error('Error updating transaction info:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json({ message: 'Transaction date updated successfully', transactionID });
    });
  });
};

// Menghapus transaksi berdasarkan ID
const deleteTransaction = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM TransactionInfo WHERE transactionID = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting transaction:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  });
};

module.exports = {
  listTransactions,
  addTransactionDetail,
  createTransaction,
  generateTransactionID,
  deleteTransaction,
  getTransactionDetails
};
