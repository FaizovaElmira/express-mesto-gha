const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: "Server Error" });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send({ message: "Server Error" });
  }
};

const createUser = async (req, res) => {
  const newUserData = req.body;

  try {
    const newUser = await User.create(newUserData);
    res.status(201).send(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map((err) => err.message);
      res.status(400).send({ message: errorMessages.join(", ") });
    } else {
      res.status(500).send({ message: "Server Error" });
    }
  }
};

const updateProfile = async (req, res) => {
  const { name, about } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errorMessages = Object.values(err.errors).map((err) => err.message);
      res.status(400).json({ message: errorMessages.join(', ') });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      res.status(404).send({ message: "User not found" });
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map((err) => err.message);
      res.status(400).send({ message: errorMessages.join(", ") });
    } else {
      res.status(500).send({ message: "Server Error" });
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

