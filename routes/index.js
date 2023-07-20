const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {
  login,
  createUser,
} = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const { validateSignIn, validateSignUp } = require('../middlewares/validate');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

// Публичные роуты
router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);

// Роуты, которые требуют авторизации
router.use('/users', authMiddleware, userRoutes);
router.use('/cards', authMiddleware, cardRoutes);

module.exports = router;
