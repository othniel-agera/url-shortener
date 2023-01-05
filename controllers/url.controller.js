// const URL = require('../models/url.model');
const URLLib = require('../lib/url.lib');
const URL = require('../models/url.model');
const asyncHandler = require('../middlewares/async.middleware');
const ErrorResponse = require('../utils/errorResponse.util');
const advancedResults = require('../utils/advancedResults.util');

class BookController {
  constructor() {
    this.urlLib = new URLLib();
  }

  /**
   * @desc Shorten URl
   * @route POST /shorten
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
   * @route GET /:nanoURL
   * @access Private
   */
  visitURL = asyncHandler(async (req, res) => {
    const { nanoURL } = req.params;
    const isURLIdinDB = await this.urlLib.isURLIdinDB(nanoURL);
    if (!isURLIdinDB) {
      throw new ErrorResponse(`NanoUrl: ${nanoURL} is not in correct`, 404);
    }
    const url = await this.urlLib.fetchURL({ urlId: nanoURL });
    const addHttps = url.originalURL && (url.originalURL.includes('http://') || url.originalURL.includes('https://')) ? url.originalURL : `https://${url.originalURL}`;
    res.redirect(addHttps);
  });

  /**
   * @desc Get shirtened URLs
   * @route GET /nanoURLs
   * @access Private
   */
  getShortened = asyncHandler(async (req, res) => {
    const { query } = req;
    const {
      page, limit, select, sort, ...filter
    } = query;
    const result = await advancedResults(URL, filter, {
      page,
      limit,
      select,
      sort,
      populate: 'user',
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  });
}

module.exports = new BookController();
