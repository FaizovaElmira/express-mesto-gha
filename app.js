const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    // console.log('connected to db');
  });

const app = express();

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
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  // console.log(`server is running on port ${PORT}`);
});
