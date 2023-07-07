const express = require('express');
const usersData = require('./data.json');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// app.get('/users', (req, res) => {
//   res.status(200).json(usersData);
// });

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = usersData.find(user => user.id === userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.status(200).json(user);
  }
}); //получить user по id

app.post('/users', (req, res) => {
  const newUser = req.body; // Assuming the new user data is sent in the request body
  console.log(newUser);
  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})