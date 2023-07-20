const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  try {
    if (!name || !link) {
      throw new BadRequestError('Переданы некорректные данные при создании карточки');
    } else if (name.length < 2) {
      throw new BadRequestError('Поле «name» должно иметь длину не менее 2 символов');
    } else if (name.length > 30) {
      throw new BadRequestError('Поле «name» должно иметь максимальную длину 30 символов');
    } else {
      const card = await Card.create({ name, link, owner: ownerId });
      res.status(201).send(card);
    }
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
    } else {
      next(error);
    }
  }
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      const owner = card.owner.toString();
      if (req.user._id.toString() === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('У вас нет прав для удаления карточки другого пользователя');
      }

      return null;
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные удаления');
      }
      next(e);
    });
};

const likeCard = async (req, res, next) => {
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      }

      res.status(200).send(card);
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка');
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }

    res.status(200).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные для снятия лайка');
    } else {
      next(error);
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
