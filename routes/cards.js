const router = require('express').Router();
const {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', removeCard);
router.put('./:cardId', likeCard);
router.delete('./:cardId', dislikeCard);

module.exports = router;
