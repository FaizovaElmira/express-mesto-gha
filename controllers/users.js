const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  const ownerId = req.user;

  try {
    const userAdmin = await User.findById(ownerId);
    if (userAdmin) {
      res.status(200).send({ data: userAdmin });
    } else {
      throw new NotFoundError(`Пользователь по указанному ${ownerId} не найден`);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError(`Невалидный id ${ownerId}`));
    } else {
      next(error);
    }
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    next(new NotFoundError('Передан несуществующий в БД userId'));
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const { _id } = newUser;
    res.status(200).send({
      _id,
      name,
      about,
      avatar,
      email,
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError('Этот email уже занят'));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(error);
    }
  }
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const ownerId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(error);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const ownerId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные'));
    } else {
      next(error);
    }
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
