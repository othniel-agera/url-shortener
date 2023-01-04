const { Router } = require('express');
const { authenticate } = require('../middlewares/authentication.middleware');
const {
  shortenURL,
} = require('../controllers/url.controller');

const router = Router();

router.post('/shorten', authenticate, shortenURL);

module.exports = router;
