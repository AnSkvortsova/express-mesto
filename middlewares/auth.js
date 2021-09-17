const jwt = require('jsonwebtoken');

const authorization = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Ошибка авторизации' });
  }

  const payload = jwt.verify(token, 'secret_key');

  if (payload) {
    req.user = payload;
  }
  return res.status(401).send({ message: 'Ошибка авторизации' });
};

module.exports = { authorization };
