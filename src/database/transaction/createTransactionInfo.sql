CREATE TABLE TransactionInfo (
    transactionID VARCHAR(15) PRIMARY KEY,
    orderDateTime DATETIME NOT NULL,
    totalAmount DECIMAL(10, 2) DEFAULT 0,
    payment DECIMAL(10, 2) DEFAULT 0,
    change DECIMAL(10, 2) DEFAULT 0,
    buyerName VARCHAR(255) DEFAULT '-',
    userID CHAR(6), -- Foreign Key
    FOREIGN KEY (userID) REFERENCES Users(userId)
);