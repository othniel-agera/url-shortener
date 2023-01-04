// const URL = require('../models/url.model');
const URLLib = require('../lib/url.lib');
const asyncHandler = require('../middlewares/async.middleware');
const ErrorResponse = require('../utils/errorResponse.util');
// const advancedResults = require('../utils/advancedResults.util');

class BookController {
  constructor() {
    this.urlLib = new URLLib();
  }

  /**
   * @desc Shorten URl
   * @route POST /url/shorten
   * @access Private
   */
  shortenURL = asyncHandler(async (req, res) => {
    const { originalURL } = req.body;
    const isURLinDB = await this.urlLib.isURLinDB(originalURL);
    if (isURLinDB) {
      throw new ErrorResponse(`URL: ${originalURL} has already been shortened`, 422);
    }
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const url = await this.urlLib.shortenURL({ originalURL, baseURL, user: req.user });
    return res.status(201).json({
      success: true,
      data: url,
    });
  });

  /**
   * @desc Visit URL
   * @route POST /url/visit
   * @access Private
   */
  visitURL = asyncHandler(async (req, res) => {
    const { originalURL } = req.param;
    const isURLinDB = await this.urlLib.isURLinDB(originalURL);
    if (isURLinDB) {
      throw new ErrorResponse(`URL: ${originalURL} has already been shortened`, 422);
    }
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const url = await this.urlLib.shortenURL(originalURL, baseURL);
    return res.status(201).json({
      success: true,
      data: url,
    });
  });
}

module.exports = new BookController();
