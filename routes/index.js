const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {
  login,
  createUser,
} = require('../controllers/users');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.post('/signin', login);

router.post('/signup', createUser);

module.exports = router;
