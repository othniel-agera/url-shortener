const { nanoid } = require('nanoid');
const URL = require('../models/url.model');
const ErrorResponse = require('../utils/errorResponse.util');

class URLLib {
  constructor() {
    this.URLModel = URL;
  }

  isURLinDB = async (url) => {
    const urlInDB = await this.fetchURL({ originalURL: url });
    if (!urlInDB) return false;
    return true;
  };

  isURLIdinDB = async (nanoURL) => {
    const url = await this.fetchURL({ urlId: nanoURL });
    if (!url) return false;
    return true;
  };

  shortenURL = async (originalURL, baseURL) => {
    try {
      const nanoURL = nanoid(10);
      const isURLIdinDB = await this.isURLIdinDB(nanoURL);
      if (isURLIdinDB) {
        throw new ErrorResponse(`NanoUrl: ${nanoURL} is not unique please try again`, 422);
      }
      const url = new this.URLModel({
        urlId: nanoURL,
        originalURL,
        shortenedURL: `${baseURL}/${nanoURL}`,
      });
      return await url.save();
    } catch (error) {
      console.log(error);
      throw new ErrorResponse(error.message, 400);
    }
  };

  destroyURL = async (value) => {
    const { URLModel } = this;
    try {
      await URLModel.findOneAndDelete({ ...value });
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };

  fetchURLs = async (values = {}) => {
    const { URLModel } = this;
    const books = await URLModel.find(values).exec();
    return books;
  };

  fetchURL = async (value) => {
    const { URLModel } = this;
    const user = await URLModel.findOne(value).exec();
    return user;
  };
}
module.exports = URLLib;
