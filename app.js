const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes');

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

app.use((req, res, next) => {
  req.user = {
    _id: '64a9acf46b9fa3b5787a4046',
  };

  next();
});

app.use(bodyParser.json());

// Middleware для установки заголовка Content-Type для всех ответов в формате JSON
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(routes);

app.listen(PORT, () => {
  // console.log(`server is running on port ${PORT}`);
});
