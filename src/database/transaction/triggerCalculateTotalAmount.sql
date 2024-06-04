DELIMITER //

CREATE TRIGGER after_insert_transactiondetail
AFTER INSERT ON TransactionDetail
FOR EACH ROW
BEGIN
    DECLARE total DECIMAL(10, 2);
    
    -- Hitung totalAmount berdasarkan quantity dan medicinePrice
    SELECT SUM(td.quantity * md.medicinePrice) INTO total
    FROM TransactionDetail td
    INNER JOIN MedicineData md ON td.medicineID = md.medicineID
    WHERE td.transactionID = NEW.transactionID;
    
    -- Update totalAmount di tabel TransactionInfo
    UPDATE TransactionInfo SET totalAmount = total WHERE transactionID = NEW.transactionID;
END;
//

CREATE TRIGGER after_update_transactiondetail
AFTER UPDATE ON TransactionDetail
FOR EACH ROW
BEGIN
    DECLARE total DECIMAL(10, 2);
    
    -- Hitung totalAmount berdasarkan quantity dan medicinePrice
    SELECT SUM(td.quantity * md.medicinePrice) INTO total
    FROM TransactionDetail td
    INNER JOIN MedicineData md ON td.medicineID = md.medicineID
    WHERE td.transactionID = NEW.transactionID;
    
    -- Update totalAmount di tabel TransactionInfo
    UPDATE TransactionInfo SET totalAmount = total WHERE transactionID = NEW.transactionID;
END;
//

CREATE TRIGGER after_delete_transactiondetail
AFTER DELETE ON TransactionDetail
FOR EACH ROW
BEGIN
    DECLARE total DECIMAL(10, 2);
    
    -- Hitung totalAmount berdasarkan quantity dan medicinePrice
    SELECT SUM(td.quantity * md.medicinePrice) INTO total
    FROM TransactionDetail td
    INNER JOIN MedicineData md ON td.medicineID = md.medicineID
    WHERE td.transactionID = OLD.transactionID;
    
    -- Update totalAmount di tabel TransactionInfo
    UPDATE TransactionInfo SET totalAmount = total WHERE transactionID = OLD.transactionID;
END;
//

DELIMITER ;
