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
    res.status(400).send({
      message: `${Object.values(err.errors)
        .map((error) => error.message)
        .join(', ')}`,
    });
    return;
  }
  findDefaultError(res);
};

module.exports = {
  findUserError,
  findDefaultError,
  findValidationError,
};
