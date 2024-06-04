DELIMITER //

CREATE TRIGGER before_insert_users
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    SET NEW.userId = generate_user_id();
END;
//

DELIMITER ;