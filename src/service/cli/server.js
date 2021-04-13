"use strict";

const DEFAULT_PORT = 3000;
const MOCK_FILE_PATH = `./mocks.json`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const chalk = require(`chalk`);
const {HttpCode} = require(`../../HttpCode`);
const {
  readContentJSON,
  readContentTxt,
  createCommentsList,
  createOffer,
} = require(`../../utils`);
const {offerValidator} = require(`../middlewares/offerValidator`);
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

const returnItemByID = async (arr, id) => {
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

    let allOffersList = await readContentJSON(MOCK_FILE_PATH);

    const titlesList = await returnPropertyList(allOffersList, `title`);
    const categories = await readContentTxt(FILE_CATEGORIES_PATH);
    const comments = await readContentTxt(FILE_COMMENTS_PATH);
    const message = titlesList.map((post) => `<li>${post}</li>`).join(``);

    const app = express();
    // eslint-disable-next-line new-cap
    const api = express.Router();
    app.use(`/api`, api);

    app.get(`/`, async (req, res) => {
      try {
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    });

    api.use(
        `/offers`,
        offersRouter.get(`/`, async (req, res) => {
          res.json(allOffersList);
        })
    );

    api.post(`/offers`, offerValidator, (req, res) => {
      const newOffer = createOffer(req.body);
      allOffersList.push(newOffer[0]);
      res.json(newOffer[0]);
    });

    api.get(`/offers/:offerId`, async (req, res) => {
      try {
        const offer = await returnItemByID(allOffersList, req.params.offerId);
        if (offer) {
          res.json(offer);
        } else {
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    });

    api.put(`/offers/:offerId`, async (req, res) => {
      try {
        const offer = await returnItemByID(allOffersList, req.params.offerId);

        if (offer) {
          offer.title = `Updated ${offer.title}`;
          res.json(offer);
        } else {
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    });

    api.delete(`/offers/:offerId`, async (req, res) => {
      try {
        const offer = await returnItemByID(allOffersList, req.params.offerId);

        if (offer) {
          allOffersList = allOffersList.filter(
              (item) => item.id !== req.params.offerId
          );

          if (allOffersList.length < 1) {
            sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
          } else {
            res.json(allOffersList);
          }
        } else {
          sendResponse(
              res,
              HttpCode.NOT_FOUND,
              `Offer with id ${req.params.offerId} not found`
          );
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    });

    api.get(`/offers/:offerId/comments`, async (req, res) => {
      try {
        const offer = await returnItemByID(allOffersList, req.params.offerId);

        if (offer) {
          res.json(offer.comments);
        } else {
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    });

    api.delete(`/offers/:offerId/comments/:commentId`, async (req, res) => {
      try {
        const offer = await returnItemByID(allOffersList, req.params.offerId);
        const comment = await returnItemByID(
            offer.comments,
            req.params.commentId
        );

        if (offer && comment) {
          const newCommentsList = offer.comments.filter(
              (item) => item.id !== req.params.commentId
          );

          offer.comments = newCommentsList;
          res.json(offer);
        } else {
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
        }
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    });

    api.post(`/offers/:offerId/comments/`, async (req, res) => {
      try {
        const offer = await returnItemByID(allOffersList, req.params.offerId);
        const newComment = createCommentsList(comments, 1);

        offer.comments.push(newComment[0]);
        res.json(offer);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    });

    api.get(`/search`, async (req, res) => {
      const foundByTitleArr = allOffersList.filter((item) => {
        return item.title.includes(req.query.query);
      });

      if (foundByTitleArr.length) {
        try {
          res.json(foundByTitleArr);
        } catch (err) {
          sendResponse(res, HttpCode.NOT_FOUND, err);
        }
      } else {
        sendResponse(res, HttpCode.NOT_FOUND, `no offers with such title`);
      }
    });

    api.use(`/categories`, async (req, res) => {
      try {
        res.json(categories);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, err);
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
