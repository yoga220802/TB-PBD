const express = require('express');
const router = express.Router();
const {getMedicines, addMedicine, editMedicine, deleteMedicine, getMedicineById} = require('../controllers/medicineController');

router.get('/get-medicines', getMedicines);
router.get('/get-medicine/:id', getMedicineById);
router.post('/add', addMedicine);
router.put('/edit/:id', editMedicine);
router.delete('/delete/:id', deleteMedicine);

module.exports = router;