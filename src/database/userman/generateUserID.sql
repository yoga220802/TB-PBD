DELIMITER //

CREATE FUNCTION generate_user_id() RETURNS CHAR(6)
BEGIN
    DECLARE new_id CHAR(6);
    DECLARE max_id INT;

    SELECT COALESCE(MAX(CAST(SUBSTRING(userId, 4, 3) AS UNSIGNED)), 0) + 1 INTO max_id FROM Users;

    SET new_id = CONCAT('usr', LPAD(max_id, 3, '0'));

    RETURN new_id;
END;
//

DELIMITER ;