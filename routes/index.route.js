const express = require('express');

const router = express.Router();
const userRoute = require('./user.route');
const urlRoute = require('./url.route');

router.use('/auth', userRoute);
router.use('/url', urlRoute);

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to the Book-Rental-Store API',
  });
});

router.all('*', (req, res) => {
  res.status(404).json({
    message: 'Invalid request, Route does not exist',
  });
});

module.exports = router;
