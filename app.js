const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(
  'mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('connected to MongoDB');
  }
);

app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6134bb60cd51a4b90d531ee5',
//   };
//
//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/cards', routerCards);
app.use('/users', routerUsers);

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});
