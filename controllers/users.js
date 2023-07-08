// const User = require("../models/User");
const usersData = require('../data.json');

const getUsers = (req, res) => {
  res.status(200).json(usersData);
};

const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = usersData.find(user => user.id === userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.status(200).json(user);
  }
};

const createUser = (req, res) => {
  const newUser = req.body; // Assuming the new user data is sent in the request body
  console.log(newUser);
  res.status(201).json(newUser);
};

const updateUserById = (req, res) => {
};

const deleteUserById = (req, res) => {
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById
}