"use strict";

const DEFAULT_PORT = 3000;
const MOCK_FILE_PATH = `./mocks.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const chalk = require(`chalk`);
const {HttpCode} = require(`../../HttpCode`);
const {
  readContentJSON,
  readContentTxt,
  generateOffers,
} = require(`../../utils`);
const {Router} = require(`express`);
const offersRouter = new Router();
const express = require(`express`);

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    "Content-Type": `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const returnPropertyList = async (arr, prop) => {
  return arr.map((item) => {
    return item[prop];
  });
};

const returnOfferByID = async (arr, id) => {
  const offer = arr.find((item) => {
    return item.id === id;
  });

  return offer;
};

module.exports = {
  name: `--server`,
  async run(args) {
    const port = args ? Number.parseInt(args[0], 10) : DEFAULT_PORT;
    const notFoundMessageText = `Not found`;

    const allOffersList = await readContentJSON(MOCK_FILE_PATH);

    const titlesList = await returnPropertyList(allOffersList, "title");
    const sentences = await readContentTxt(FILE_SENTENCES_PATH);
    const titles = await readContentTxt(FILE_TITLES_PATH);
    const categories = await readContentTxt(FILE_CATEGORIES_PATH);
    const comments = await readContentTxt(FILE_COMMENTS_PATH);
    const message = titlesList.map((post) => `<li>${post}</li>`).join(``);
    const app = express();

    app.get(`/`, async (req, res) => {
      try {
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err, req, res);
      }
    });

    app.use(
      `/offers`,
      offersRouter.get(`/`, async (req, res) => {
        res.json(allOffersList);
      })
    );

    app.post("/offers", (req, res) => {
      const newOffer = generateOffers(
        1,
        titles,
        categories,
        sentences,
        comments
      );
      allOffersList.push(newOffer[0]);
      res.json(newOffer[0]);
    });

    app.get(`/offers/:offerId`, async (req, res) => {
      try {
        const offer = await returnOfferByID(allOffersList, req.params.offerId);
        if (offer) {
          res.json(offer);
        } else {
          sendResponse(res, HttpCode.NOT_FOUND, req, res);
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err, req, res);
      }
    });


    app.put(`/offers/:offerId`, async (req, res) => {
      try {
        const offer = await returnOfferByID(allOffersList, req.params.offerId);
        console.log("NEW VALUE: " , req.body)
        if (offer) {
          res.json(offer);
        } else {
          sendResponse(res, HttpCode.NOT_FOUND, req, res);
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err, req, res);
      }
    });

    app.use(`/categories`, async (req, res) => {
      try {
        const categories = await readContentTxt(FILE_CATEGORIES_PATH);
        res.json(categories);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err, req, res);
      }
    });

    app.use(function (req, res) {
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
    });

    app.listen(port, (err) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }
      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  },
};
