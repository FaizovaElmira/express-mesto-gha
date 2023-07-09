const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

module.exports = router;
