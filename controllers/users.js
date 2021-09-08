const User = require('../models/user');

// ОШИБКИ
const findUserError = (user, res) => {
  if (!user) {
    res.status(404).send({ message: 'Пользователь не найден' });
    return;
  }
  res.send({ data: user });
};

const findDefaultError = (res) => {
  res.status(500).send({ message: 'Произошла ошибка' });
};

const findValidationError = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: err.message });
    return;
  }
  findDefaultError(res);
};

const findCastError = (err, res) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }
  findDefaultError(res);
};

// КОНТРОЛЛЕРЫ
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      findUserError(user, res);
    })
    .catch((err) => findCastError(err, res));
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
