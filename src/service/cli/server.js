"use strict";

const DEFAULT_PORT = 3000;
const MOCK_FILE_PATH = `./mocks.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const fs = require(`fs`).promises;
const fs2 = require(`fs`);
const chalk = require(`chalk`);
const {HttpCode} = require(`../../HttpCode`);
const {returnCategories, readContent} = require(`../../utils`);
const {Router} = require(`express`);
const offersRouter = new Router();

const express = require(`express`);
const {nanoid} = require("nanoid");

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
    //console.log('item', item);
    return item[prop];
  });
};

const returnOfferByID = async (arr, id) => {
  const offer = arr.find((item) => {
    return item.id === id;
  });

  return offer;
};

const returnList = (arr) => {
  const list = arr.map((item) => {
    if (typeof item === "object" && item !== null) {
      return `<li id="${item.id}">${item.text}</li>`;
    } else {
      return `<li>${item}</li>`;
    }
  });
  return `<ul>${list.join("")}</ul>`;
};

module.exports = {
  name: `--server`,
  async run(args) {
    const port = args ? Number.parseInt(args[0], 10) : DEFAULT_PORT;
    const notFoundMessageText = `Not found`;

    const allOffersList = await readContent(MOCK_FILE_PATH);

    const titlesList = await returnPropertyList(allOffersList, "title");
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
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
        // const markdownOffersList = allOffersList.map((offer) => {
        //   const categories = returnList(offer.category);
        //   const comments = returnList(offer.comments);
        //   return `<div><h1>${offer.title}</h1>${categories}<div>id: ${offer.id}</div><div>type: <bold>${offer.type}</bold></div><div>price: <bold>${offer.sum}</bold></div></div><h2>comments</h2>${comments}`;
        // });
        res.json(allOffersList)
        //sendResponse(res, HttpCode.OK, `<div>${markdownOffersList}</div>`);
      })
    );

    app.post("/offers", (request, response) => {
      const newOffer = generateOffers(1, titles, categories, sentences, comments);
      console.log('newOffer', newOffer[0]);
    });

    app.get(`/offers/:offerId`, async (req, res) => {
      try {
        const offer = await returnOfferByID(allOffersList, req.params.offerId);
        if (offer) {
          const categories = returnList(offer.category);
          const comments = returnList(offer.comments);
          sendResponse(
            res,
            HttpCode.OK,
            `<div><h1>${offer.title}</h1>${categories}<div>id: ${offer.id}</div><div>type: <bold>${offer.type}</bold></div><div>price: <bold>${offer.sum}</bold></div></div><h2>comments</h2>${comments}`
          );
        } else {
          sendResponse(res, HttpCode.NOT_FOUND, err, req, res);
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err, req, res);
      }
    });

    app.use(`/categories`, async (req, res) => {
      try {
        const categories = await returnCategories(FILE_CATEGORIES_PATH);
        sendResponse(res, HttpCode.OK, `<div>${returnList(categories)}</div>`);
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
