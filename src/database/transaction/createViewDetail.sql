CREATE VIEW DetailedTransactionView AS
SELECT 
    ti.transactionID,
    ti.totalAmount AS totalHarga,
    ti.orderDateTime AS tanggalTransaksi,
    ti.payment AS uangYangDibayar,
    ti.paymentChange AS kembalian,
    ti.buyerName AS namaPembeli,
    u.fullName AS namaApoteker,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'medicineID', md.medicineID,
            'namaObat', md.medicineName,
            'hargaSatuan', md.medicinePrice,
            'jumlahBeli', td.quantity,
            'totalHargaItem', (td.quantity * md.medicinePrice)
        )
    ) AS items
FROM 
    TransactionInfo ti
JOIN 
    TransactionDetail td ON ti.transactionID = td.transactionID
JOIN 
    MedicineData md ON td.medicineID = md.medicineID
JOIN
    Users u ON ti.userID = u.userId
GROUP BY 
    ti.transactionID, ti.totalAmount, ti.orderDateTime, ti.payment, ti.paymentChange, ti.buyerName, u.fullName;