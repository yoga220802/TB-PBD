-- Create userRole table
CREATE TABLE userRole (
    -- roleId CHAR(6) NOT NULL,
    roleId ENUM('APOTKR', 'PSTOK', 'KAPOT', 'ADMIN') NOT NULL,
    roleName VARCHAR(50) NOT NULL,
    PRIMARY KEY (roleId)
);

-- Create users table
CREATE TABLE users (
    userId CHAR(6),
    usrname VARCHAR(255) NOT NULL,
    usrpass VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    phoneNum CHAR(13) NOT NULL,
    roleId ENUM('APOTKR', 'PSTOK', 'KAPOT', 'ADMIN') NOT NULL,
    PRIMARY KEY (userId),
    FOREIGN KEY (roleId) REFERENCES userRole (roleId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);