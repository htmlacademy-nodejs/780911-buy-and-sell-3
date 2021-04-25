"use strict";

const MOCK_FILE_PATH = `./mocks.json`;
const {HttpCode} = require(`../../../HttpCode`);
const {
  readContentJSON,
  sendResponse,
} = require(`../../../utils`);

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

  app.use(`/api`, await apiRoutes());

  app.get(`/`, async (req, res) => {
    try {
      sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
    } catch (err) {
      sendResponse(res, HttpCode.NOT_FOUND, err);
    }
  });

  app.use(function (req, res) {
    sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
  });

  return app;
};

module.exports = {
  server,
  app
};
