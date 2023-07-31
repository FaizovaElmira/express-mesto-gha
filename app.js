const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const handleErrors = require('./errors/handleErrors');
const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes');
const auth = require('./middlewares/auth');

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  });

const app = express();

// Защитные middleware

app.use(helmet()); // Добавляем Helmet middleware

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 100, // максимальное количество запросов
});
app.use(limiter); // Добавляем ограничитель запросов

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Middleware для установки заголовка Content-Type для всех ответов в формате JSON
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(auth);
app.use(routes);

// Обработчик для неправильного пути, возвращающий JSON-ответ с кодом 404
app.use((req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
