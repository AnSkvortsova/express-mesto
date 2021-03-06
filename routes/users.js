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
        userId: Joi.string().length(24).hex(),
      }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /https?:\/\/(www\.)?[-\w()@:%!$+.~#?&/=]+\.[-\w()@:%!$+.~#?&/=]+$/,
        ),
    }),
  }),
  updateAvatar,
);

module.exports = router;
