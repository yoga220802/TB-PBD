-- Menyisipkan data ke tabel userRole
INSERT INTO userRole (roleId, roleName)
VALUES
    ('APOTKR', 'Apoteker'),
    ('PSTOK', 'Pengelola Stok'),
    ('KAPOT', 'Kepala Apotek'),
    ('ADMIN', 'Admin');

-- Menyisipkan data ke tabel users
INSERT INTO users (usrname, usrpass, fullName, phoneNum, roleId)
VALUES
    ('dudung', 'dudung123', 'Dudung Ganteng', '081234567890', 'APOTKR'),
    ('dadang', 'dadang123', 'Dadang Ganteng', '029876543210', 'PSTOK'),
    ('john', 'john123', 'John Doe', '085432198765', 'KAPOT'),
    ('admin', 'admin', 'Kang Admin', '087654321098', 'ADMIN');
