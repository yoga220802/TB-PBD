const express = require('express');
const { addUser, getUsers, deleteUser, editUser, getUserById } = require('../controllers/userController');

const router = express.Router();

router.post('/addUser', addUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.delete('/deleteUser/:userId', deleteUser);
router.put('/editUser/:userId', editUser);

module.exports = router;
