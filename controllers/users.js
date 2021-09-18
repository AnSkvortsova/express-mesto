const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      findUserError(user, res);
    })
    .catch((err) => findCastError(err, res));
};

const getAuthUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(user)
      if (!user) {
        res
          .status(403)
          .send({ message: 'Доступ запрещен. Необходима авторизация' });
        return;
      }
      res.send({ data: user });
    })
    .catch(() => findDefaultError(res));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => findDefaultError(res));
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      findValidationError(err, res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret_key', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
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
  getUserById,
  getAuthUser,
  getUsers,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
