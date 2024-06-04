CREATE VIEW userView AS
SELECT u.userId, u.usrname, u.usrpass, u.fullName, u.phoneNum, u.roleId, r.roleName
FROM users u
JOIN userRole r ON u.roleId = r.roleId;
