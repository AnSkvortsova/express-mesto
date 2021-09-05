const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', (err) => {
  if (err) throw err;
  console.log('connected to MongoDB');
});

app.use(express.json());
app.use('/users', routerUsers);

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});
