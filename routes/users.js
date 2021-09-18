const router = require('express').Router();
const {
  getUserById,
  getAuthUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/me', getAuthUser);
router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
