CREATE TRIGGER set_transaction_id
BEFORE INSERT ON TransactionInfo
FOR EACH ROW
BEGIN
    SET NEW.transactionID = generate_transaction_id(NEW.orderDateTime);
END;