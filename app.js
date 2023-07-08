const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json());

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})