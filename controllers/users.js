const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => User
    .create({ name, about, avatar, email, password: hash })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new Conflict('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    }));
};

const login = (req, res, next) => {
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
    .catch(() => {
      throw new Unauthorized('Неправильная почта или пароль');
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
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
