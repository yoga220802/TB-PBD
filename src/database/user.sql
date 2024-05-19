CREATE TABLE userRole(
    roleId CHAR(7) NOT NULL,
    roleName VARCHAR(50) NOT NULL,
    PRIMARY KEY(roleId)
);

CREATE TABLE users (
    userId CHAR(6) NOT NULL ,
    usrname VARCHAR(255) NOT NULL,
    usrpass VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    roleId CHAR(7) NOT NULL,
    PRIMARY KEY(userId),
    FOREIGN KEY (roleId) REFERENCES userRole(roleId) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Insert rows into table 'userRole'
INSERT INTO userRole (roleId, roleName) VALUES
('APOTKR', 'Apoteker'),
('PSTOK', 'Pengelola Stok'),
('KAPOT', 'Kepala Apotek'),
('ADMIN', 'Admin')
;

INSERT INTO users (userId, usrname, usrpass, fullName, roleId) VALUES
('usr001', 'dudung', 'dudung123', 'Dudung Ganteng', 'APOTKR'),
('usr002', 'dadang', 'dadang123', 'Dadang Ganteng', 'PSTOK'),
('usr003', 'john', 'john123', 'John Doe', 'KAPOT'),
('usr004', 'admin', 'admin', 'Kang Admin', 'ADMIN')
