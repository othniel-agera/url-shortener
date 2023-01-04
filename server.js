const express = require('express');
const morgan = require('morgan');
const routes = require('./routes/index.route');
const errorHandler = require('./middlewares/error.middleware');
require('./config/config');
require('./models/index.model');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/', routes);

app.use(errorHandler);

const PORT = process.env.NODE_ENV === 'test' ? 2345 : process.env.PORT || 4040;

app.listen(PORT, () => {
  console.log(`Server started on port #${PORT}`);
});

module.exports = { app };
