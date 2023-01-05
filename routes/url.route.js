const { Router } = require('express');
const { authenticate } = require('../middlewares/authentication.middleware');
const {
  shortenURL, visitURL, getShortened,
} = require('../controllers/url.controller');

const router = Router();

router.post('/shorten', authenticate, shortenURL);
router.get('/nanoURLs', authenticate, getShortened);
router.get('/:nanoURL', visitURL);

module.exports = router;
