const { Router } = require('express');
const { authenticate } = require('../middlewares/authentication.middleware');
const {
  shortenURL, visitURL, getShortened,
} = require('../controllers/url.controller');
const { postShortenURLValidator } = require('../utils/validator.util');

const router = Router();

router.post('/shorten', authenticate, postShortenURLValidator, shortenURL);
router.get('/nanoURLs', authenticate, getShortened);
router.get('/:nanoURL', visitURL);

module.exports = router;
