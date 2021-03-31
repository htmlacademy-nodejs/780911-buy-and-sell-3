"use strict";

const DEFAULT_PORT = 3000;
const MOCK_FILE_PATH = `./mocks.json`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
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

const returnPropertyList = async (file, prop) => {
  const errMessage = `The file does not exist.`;
  try {
    if (fs2.existsSync(file)) {
      const mockData = await readContent(file);
      const arrMock = JSON.parse(mockData);
      return JSON.parse(arrMock).map((item) => {
        return item[prop];
      });
    } else {
      console.log(errMessage);
      return false;
    }
  } catch (err) {
    console.log(errMessage);
    return false;
  }
};

const returnOfferByID = async (file, id) => {
  const errMessage = `The file does not exist.`;
  try {
    if (fs2.existsSync(file)) {
      const mockData = await readContent(file);
      const arrMock = JSON.parse(mockData);
      const offer = JSON.parse(arrMock).find((item) => {
        return item.id === id;
      });

      return offer;
    } else {
      console.log(errMessage);
      return false;
    }
  } catch (err) {
    console.log(errMessage);
    return false;
  }
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
    const titlesList = await returnPropertyList(MOCK_FILE_PATH, "title");

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
        const offersList = await fs.readFile(MOCK_FILE_PATH, `utf8`);
        const jsonRes = JSON.parse(offersList);

        const markdownOffersList = JSON.parse(jsonRes).map(offer => {
          const categories = returnList(offer.category);
          const comments = returnList(offer.comments);
          return(`<div><h1>${offer.title}</h1>${categories}<div>id: ${offer.id}</div><div>type: <bold>${offer.type}</bold></div><div>price: <bold>${offer.sum}</bold></div></div><h2>comments</h2>${comments}`);
        })

        sendResponse(
          res,
          HttpCode.OK,
          `<div>${markdownOffersList}</div>`
        );
      })
    );

    app.post('/offers',(request,response) => {
      console.log(request.body);
    });

    app.get(`/offers/:offerId`, async (req, res) => {
      try {
        const offer = await returnOfferByID(MOCK_FILE_PATH, req.params.offerId);
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
