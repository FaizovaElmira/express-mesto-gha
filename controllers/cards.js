const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    res.status(500).send({ error: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  try {
    if (!name || !link) {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    } else if (name.length < 2) {
      res.status(400).send({ message: 'Поле «name» должно иметь длину не менее 2 символов' });
    } else if (name.length > 30) {
      res.status(400).send({ message: 'Поле «name» должно иметь максимальную длину 30 символов' });
    } else {
      const card = await Card.create({ name, link, owner: ownerId });
      res.status(201).send(card);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err) => err.message);
      res.status(400).send({ message: errorMessages.join(', ') });
    } else {
      res.status(500).send({ error: 'На сервере произошла ошибка' });
    }
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  try {
    const card = await Card.findOneAndDelete({ _id: cardId, owner: userId });

    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    } else {
      res.status(200).send(card);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user._id;

    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: ownerId } },
        { new: true },
      );

      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(200).send(card);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    }
  } catch (error) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
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
      res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(200).send(card);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
