const router = require('express').Router();
const {getUsers, getUserById, createUser, updateUserById, deleteUserById} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.get('/', createUser);

router.get('/:id', updateUserById);

router.get('/:id', deleteUserById);


module.exports = router;