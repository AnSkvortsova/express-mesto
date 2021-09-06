const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/:userId', getUser);
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
