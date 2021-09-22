const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getUserById,
  getAuthUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  getUserById
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/^https?:\/\/(www.)?(\w+\W*)+#?$/),
    }),
  }),
  updateAvatar
);

module.exports = router;
