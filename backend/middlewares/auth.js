const jwt = require('jsonwebtoken');
//const { JWT_SECRET } = require('../utils/jwt');
const { JWT_SECRET, NODE_ENV } = process.env;
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMessage = 'Необходима авторизация';
  // Проверка авторизации
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Unauthorized(`${errorMessage}(${authorization})!!!`));
  }

  const token = authorization.replace(bearer, '');

  let payload;

  try {
    // Верифицикация токена с помощью ключа
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); 
  } catch (error) {
    return next(new Unauthorized('Необходимо авторизироваться'));
  }
  req.user = payload; // Данные пользователя передаются в объект запроса
  next();
  return null;
};

module.exports = auth;
