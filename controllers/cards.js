const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  try {
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Invalid data' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

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

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId } },
      { new: true },
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

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
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
  dislikeCard,
};
