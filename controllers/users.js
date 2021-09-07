const User = require('../models/user');
const {
  findUserError,
  findDefaultError,
  findValidationError,
} = require('../utils/errors');

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      findUserError(user, res);
    })
    .catch(() => findDefaultError(res));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => findDefaultError(res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      findValidationError(err, res);
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      findUserError(user, res);
    })
    .catch((err) => {
      findValidationError(err, res);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      findUserError(user, res);
    })
    .catch((err) => {
      findValidationError(err, res);
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
};
