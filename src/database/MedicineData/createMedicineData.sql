CREATE TABLE MedicineData (
    medicineID INT AUTO_INCREMENT PRIMARY KEY,
    medicineName VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    medicinePrice DECIMAL(10, 2) NOT NULL,
    medicineUnit VARCHAR(255),
    stock INT NOT NULL,
    expirationDate DATE
);  