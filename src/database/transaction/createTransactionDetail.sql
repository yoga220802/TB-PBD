CREATE TABLE TransactionDetail (
    transactionID VARCHAR(15),
    medicineID INT,
    quantity INT NOT NULL,
    totalPrice INT,
    PRIMARY KEY (transactionID, medicineID),
    FOREIGN KEY (transactionID) REFERENCES TransactionInfo(transactionID),
    FOREIGN KEY (medicineID) REFERENCES MedicineData(medicineID)
);