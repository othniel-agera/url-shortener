// const URL = require('../models/url.model');
const URLLib = require('../lib/url.lib');
const UserLib = require('../lib/user.lib');
const URL = require('../models/url.model');
const asyncHandler = require('../middlewares/async.middleware');
const ErrorResponse = require('../utils/errorResponse.util');
const advancedResults = require('../utils/advancedResults.util');

class BookController {
  constructor() {
    this.urlLib = new URLLib();
    this.userLib = new UserLib();
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

    const { _id, urlLimit, urlsShortened } = req.user;
    if (urlsShortened >= urlLimit) {
      throw new ErrorResponse(`You have exceeded the allowed limit: ${urlLimit}. Please contact support.`, 422);
    }
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const url = await this.urlLib.shortenURL({ originalURL, baseURL, user: req.user });

    this.userLib.updateUser(_id, { urlsShortened: urlsShortened + 1 });

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
      throw new ErrorResponse(`NanoUrl: ${nanoURL} is not correct`, 404);
    }
    const url = await this.urlLib.fetchURL({ urlId: nanoURL });

    // eslint-disable-next-line no-underscore-dangle
    await this.urlLib.updateURL(url._id, { visitCount: url.visitCount + 1 });
    res.redirect(url.originalURL);
  });

  /**
   * @desc Get shortened URLs
   * @route GET /nanoURLs
   * @access Private
   */
  getShortened = asyncHandler(async (req, res) => {
    const { query, user } = req;
    const {
      page, limit, select, sort, ...filter
    } = query;
    const result = await advancedResults(URL, { ...filter, user: user.id }, {
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

  /**
   * @desc Delete shortened URL
   * @route DELETE /:nanoURLs
   * @access Private
   */
  deleteShortened = asyncHandler(async (req, res, next) => {
    const { nanoURL } = req.params;

    const isURLIdinDB = await this.urlLib.isURLIdinDB(nanoURL);
    if (!isURLIdinDB) {
      return next(
        new ErrorResponse(`URL with id: ${nanoURL} does not exist on the database`, 404),
      );
    }

    await this.urlLib.destroyURL({ urlId: nanoURL });
    return res.status(202).json({
      success: true,
    });
  });

  /**
   * @desc Delete shortened URLs
   * @route DELETE /nanoURLs
   * @access Private
   */
  deleteShorteneds = asyncHandler(async (req, res) => {
    console.log(req.user);
    // eslint-disable-next-line no-underscore-dangle
    await this.urlLib.destroyURLs(req.user._id);
    return res.status(202).json({
      success: true,
    });
  });
}

module.exports = new BookController();
