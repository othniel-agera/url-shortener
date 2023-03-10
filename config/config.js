require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(`${process.env.DB_URI}`).then(() => {
  console.log('Database connection successful');
}).catch((err) => {
  console.log('Database conection failed', err);
});
