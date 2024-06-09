const db = require('../db/db')

const getMedicines = (req, res) => {
  const sql = `SELECT * FROM MedicineData`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching medicines:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(result);
  });
};

const getMedicineById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM MedicineData WHERE medicineID = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error saat mengambil data obat", error: err });
    } else {
      res.status(200).send(result[0]);
    }
  });
};

const addMedicine = async (req, res) => {
    const { medicineName, brand, medicinePrice, medicineUnit, stock, expirationDate } = req.body;
    const sql = "INSERT INTO MedicineData (medicineName, brand, medicinePrice, medicineUnit, stock, expirationDate) VALUES (?, ?, ?, ?, ?, ?)"
    db.query(sql, [medicineName, brand, medicinePrice, medicineUnit, stock, expirationDate], (err, result) => {
        if (err) {
            console.error('Error executing stored procedure:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
          res.status(201).json({ message: 'Medicine Added successfully' });
        });
    }


const editMedicine = (req, res) => {
    console.log("Editing medicine with ID:", req.params.id); // Tambahkan log ini
    const { id } = req.params;
    const { medicineName, brand, medicinePrice, medicineUnit, stock, expirationDate } = req.body;
    console.log("Received data for update:", req.body); // Tambahkan untuk debugging
    const sql = "UPDATE medicinedata SET medicineName = ?, brand = ?, medicinePrice = ?, medicineUnit = ?, stock = ?, expirationDate = ? WHERE medicineID = ?"
    db.query(sql, [medicineName, brand, medicinePrice, medicineUnit, stock, expirationDate, id], (err, result) => {
        if (err) {
            console.error('Error updating medicine:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log(result); // Tambahkan log ini untuk melihat hasil query
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No medicine found with the given ID' });
        }
        res.status(200).json({ message: 'Medicine updated successfully' });
    });
};

const deleteMedicine = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM MedicineData WHERE medicineID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error saat menghapus data obat:', err);
            return res.status(500).send({ message: "Error saat menghapus data obat", error: err.message });
        }
        res.status(200).send({ message: "Data obat berhasil dihapus", data: result });
    });
};

module.exports = {
  getMedicines,
  getMedicineById,
  addMedicine,
  editMedicine,
  deleteMedicine
};
