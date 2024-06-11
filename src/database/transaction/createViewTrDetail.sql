CREATE VIEW TransactionDetailView AS
SELECT 
    td.transactionID,
    td.medicineID,
    md.medicineName,
    md.medicinePrice,
    td.quantity,
    td.totalPrice
FROM 
    TransactionDetail td
JOIN 
    MedicineData md ON td.medicineID = md.medicineID;