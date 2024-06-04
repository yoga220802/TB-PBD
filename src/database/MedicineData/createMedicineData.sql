CREATE TABLE MedicineData (
    medicineID INT PRIMARY KEY,
    medicineName VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    medicinePrice DECIMAL(10, 2) NOT NULL,
    medicineCategory VARCHAR(255),
    stock INT NOT NULL,
    expirationDate DATE
);