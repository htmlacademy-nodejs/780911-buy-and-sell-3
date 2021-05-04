"use strict";

const MOCK_FILE_PATH = `./mocks.json`;
const {HttpCode} = require(`../../../HttpCode`);
const {
  readContentJSON,
  sendResponse,
} = require(`../../../utils`);
const notFoundMessageText = `Not found`;
const express = require(`express`);
const returnPropertyList = async (arr, prop) => {
  return arr.map((item) => {
    return item[prop];
  });
};

let app;
const server = async () => {
  app = express();
  const apiRoutes = require(`./api-routes`);
  let allOffersList = await readContentJSON(MOCK_FILE_PATH);
  const titlesList = await returnPropertyList(allOffersList, `title`);
  const message = titlesList.map((post) => `<li>${post}</li>`).join(``);
  const {getLogger} = require(`./logger`);
  const logger = getLogger();

  app.use(`/api`, await apiRoutes());

  app.use(function (req, res, next) {
    logger.info(`Start request to url ${req.url}`);
    next();
  });
  app.get(`/`, async (req, res) => {
    try {
      sendResponse(res, HttpCode.OK, `<p>default page</p></p><ul>${message}</ul>`);
    } catch (err) {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, err);
    }
  });

  app.use(function (req, res) {
    logger.error(`requested page is not found ${res.statusCode}`);
    sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
  });

  return app;
};

module.exports = {
  server,
  app
};
