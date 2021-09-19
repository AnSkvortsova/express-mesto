const Card = require('../models/card');

// ОШИБКИ
const findCardError = (card, res) => {
  if (!card) {
    res.status(404).send({ message: 'Карточка не найдена' });
    return;
  }
  res.send({ data: card });
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
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => findDefaultError(res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      findValidationError(err, res);
    });
};

const removeCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (card.owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((data) => res.send({data}))
          .catch((err) => {
            findValidationError(err, res);
          });
      }
      res.status(403).send({ message: 'Невозможно удалить чужие данные' });
    })
    .catch((err) => findCastError(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      findCardError(card, res);
    })
    .catch((err) => findCastError(err, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      findCardError(card, res);
    })
    .catch((err) => findCastError(err, res));
};

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
