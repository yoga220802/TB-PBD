DELIMITER //

CREATE PROCEDURE addUser(
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_fullname VARCHAR(255),
    IN p_phone CHAR(13),
    IN p_roleId ENUM('APOTKR', 'PSTOK', 'KAPOT', 'ADMIN')
)
BEGIN
    -- Insert the new user into the users table
    INSERT INTO users (usrname, usrpass, fullName, phoneNum, roleId)
    VALUES (p_username, p_password, p_fullname, p_phone, p_roleId);
END //

DELIMITER ;
