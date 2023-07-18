const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: 'На сервере произошла ошибка', error });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
};

const createUser = async (req, res) => {
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
    res.status(200).send(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Некорректные данные' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка', error });
    }
  }
};

const updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const ownerId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }

    return res.status(200).send(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).send({ message: errorMessages.join(',') });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', error });
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const ownerId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(() => error.message);
      res.status(400).send({ message: errorMessages.join(',') });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
