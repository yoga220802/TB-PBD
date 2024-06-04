DELIMITER //

CREATE FUNCTION generate_transaction_id(orderDate DATETIME) RETURNS VARCHAR(15)
BEGIN
    DECLARE formatted_date VARCHAR(10);
    DECLARE order_count INT;
    DECLARE transaction_id VARCHAR(15);
    
    SET formatted_date = DATE_FORMAT(orderDateTime, '%Y%m%d');
    
    SELECT COUNT(*) + 1 INTO order_count FROM TransactionInfo 
    WHERE DATE(orderDate) = DATE(orderDateTime);
    
    SET transaction_id = CONCAT(formatted_date, '-', LPAD(order_count, 4, '0'));
    
    RETURN transaction_id;
END;
//

DELIMITER ;