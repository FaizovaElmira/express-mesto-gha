const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const { validateUser, validateUserID, validateUserAvatar } = require('../middlewares/validate');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  validateUserID,
  getUserById,
);

router.patch(
  '/me',
  validateUser,
  updateProfile,
);

router.patch(
  '/me/avatar',
  validateUserAvatar,
  updateAvatar,
);

module.exports = router;
