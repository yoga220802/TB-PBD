DELIMITER //

CREATE TRIGGER before_update_transactioninfo
BEFORE UPDATE ON TransactionInfo
FOR EACH ROW
BEGIN
    IF NEW.payment IS NOT NULL THEN
        SET NEW.change = NEW.payment - NEW.totalAmount;
    END IF;
END;
//

DELIMITER ;
