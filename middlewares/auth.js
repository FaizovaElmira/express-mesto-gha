const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const authMiddleware = (req, res, next) => {
  if (req.url.includes('/signin') || req.url.includes('/signup')) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
    return null; // явный возврат значения в конце функции
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
};

module.exports = authMiddleware;
