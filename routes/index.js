const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {
  login,
  createUser,
} = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

// Публичные роуты
router.post('/signin', login);
router.post('/signup', createUser);

// Роуты, которые требуют авторизации
router.use('/users', authMiddleware, userRoutes);
router.use('/cards', authMiddleware, cardRoutes);

module.exports = router;
