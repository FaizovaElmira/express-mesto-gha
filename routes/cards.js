const express = require('express');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validateCard, validateCardID } = require('../middlewares/validate');

const router = express.Router();

router.get('/', getAllCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardID, deleteCard);
router.put('/:cardId/likes', validateCardID, likeCard);
router.delete('/:cardId/likes', validateCardID, dislikeCard);

module.exports = router;
