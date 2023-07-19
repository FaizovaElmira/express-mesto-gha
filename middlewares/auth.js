const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
    return null; // явный возврат значения в конце функции
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};

module.exports = authMiddleware;
