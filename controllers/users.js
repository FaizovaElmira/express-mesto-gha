const User = require("../models/User");

const getUsers = (req, res) => {
    return User.find({})
        .then((users) => {
            return res.status(200).send(users);
        })
};

const getUserById = (req, res) => {
  const {id} = req.params;

  return User.findById(id)
      .then((user) => {
          if (!user) {
              return res.status(404).send({message: "User not found"});
          }
          return res.status(200).send(user);
      })
      .catch((err) => {
          return res.status(500).send({message: "Server Error"});
      })
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
      .then((newUser) => {
          return res.status(201).send(newUser);
      })
      .catch((err) => {
          if (err.name === "ValidationError") {
              return res.status(400).send({
                  message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
              });
          }
          return res.status(500).send({message: "Server Error"});
      })
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