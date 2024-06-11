const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.listTransactions);
router.get('/:id', transactionController.getTransactionDetails);
router.post('/addDetails', transactionController.addTransactionDetail);
router.post('/createTransaction', transactionController.createTransaction);
router.post('/generate-id', transactionController.generateTransactionID);
router.delete('/delete/:id', transactionController.deleteTransaction);

module.exports = router;