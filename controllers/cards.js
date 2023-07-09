const Card = require('../models/card');

// Контроллер для получения всех карточек
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Контроллер для создания новой карточки
const createCard = async (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  try {
    const card = await Card.create({ name, link, owner: userId });
    res.status(201).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Invalid data' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Контроллер для удаления карточки по идентификатору
const deleteCard = async (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  try {
    const card = await Card.findOneAndDelete({ _id: cardId, owner: userId });
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
    } else {
      res.json(card);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Контроллер для добавления лайка карточке
const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
    } else {
      res.json(card);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Контроллер для удаления лайка с карточки
const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
    } else {
      res.json(card);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};