"use strict";

const notFoundMessageText = `Not found`;
const MOCK_FILE_PATH = `./mocks.json`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const {HttpCode} = require(`../../../HttpCode`);
const {
  readContentJSON,
  readContentTxt,
  createOffer,
  createComment,
  sendResponse,
} = require(`../../../utils`);
const {
  offerValidator,
  commentValidator,
  offerPutValidator,
} = require(`../../middlewares/validators`);
const bodyParser = require(`body-parser`);
const jsonParser = bodyParser.json();
const {getLogger} = require(`./logger`);
const logger = getLogger();
const api = async () => {
  const {Router} = require(`express`);
  const router = new Router();
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

  let allOffersList = await readContentJSON(MOCK_FILE_PATH);
  const categories = await readContentTxt(FILE_CATEGORIES_PATH);

  router.use(function (req, res, next) {
    logger.debug(`Start request to url ${req.url}`);
    next();
  });

  router.get(`/offers`, (req, res) => {
    try {
      res.json(allOffersList);
      logger.info(`End request with status code ${res.statusCode}`);
    } catch (e) {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, e);
    }
  });

  router.post(`/offers`, jsonParser, offerValidator, (req, res) => {
    const newOffer = createOffer(req.body);
    allOffersList.push(newOffer);
    res.json(allOffersList[allOffersList.length - 1]);
    logger.info(`End request with status code ${res.statusCode}`);
  });

  router.get(`/offers/:offerId`, async (req, res) => {
    try {
      const offer = await returnItemByID(allOffersList, req.params.offerId);
      if (offer) {
        res.json(offer);
        logger.info(`End request with status code ${res.statusCode}`);
      } else {
        logger.error(`End request with error ${res.statusCode}`);
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
    } catch (err) {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, err);
    }
  });

  router.put(
    `/offers/:offerId`,
    jsonParser,
    offerPutValidator,
    async (req, res) => {
      try {
        let offer = await returnItemByID(allOffersList, req.params.offerId);

        if (offer) {
          offer = {...offer, ...req.body};
          res.json(offer);
          logger.info(`End request with status code ${res.statusCode}`);
        } else {
          logger.error(`End request with error ${res.statusCode}`);
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
        }
      } catch (err) {
        logger.error(`End request with error ${res.statusCode}`);
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    }
  );

  router.delete(`/offers/:offerId`, async (req, res) => {
    try {
      const offer = await returnItemByID(allOffersList, req.params.offerId);

      if (offer) {
        allOffersList = allOffersList.filter(
          (item) => item.id !== req.params.offerId
        );

        if (allOffersList.length < 1) {
          logger.error(`End request with error ${res.statusCode}`);
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
        } else {
          res.json(allOffersList);
          logger.info(`End request with status code ${res.statusCode}`);
        }
      } else {
        sendResponse(
          res,
          HttpCode.NOT_FOUND,
          `Offer with id ${req.params.offerId} not found`
        );
      }
    } catch (err) {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, err);
    }
  });

  router.get(`/offers/:offerId/comments`, async (req, res) => {
    try {
      const offer = await returnItemByID(allOffersList, req.params.offerId);

      if (offer) {
        res.json(offer.comments);
        logger.info(`End request with status code ${res.statusCode}`);
      } else {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
    } catch (err) {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, err);
    }
  });

  router.delete(`/offers/:offerId/comments/:commentId`, async (req, res) => {
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
        logger.info(`End request with status code ${res.statusCode}`);
      } else {
        logger.error(`End request with error ${res.statusCode}`);
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
    } catch (err) {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, err);
    }
  });

  router.post(
    `/offers/:offerId/comments/`,
    jsonParser,
    commentValidator,
    async (req, res) => {
      try {
        const offer = await returnItemByID(allOffersList, req.params.offerId);
        const newComment = createComment(req.body.text);

        offer.comments.push(newComment);
        res.json(offer);
      } catch (err) {
        logger.error(`End request with error ${res.statusCode}`);
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    }
  );

  router.get(`/search`, async (req, res) => {
    const foundByTitleArr = allOffersList.filter((item) => {
      return item.title.includes(req.query.query);
    });
    if (foundByTitleArr.length) {
      try {
        res.json(foundByTitleArr);
      } catch (err) {
        logger.error(`End request with error ${res.statusCode}`);
        sendResponse(res, HttpCode.NOT_FOUND, err);
      }
    } else {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, `no offers with such title`);
    }
  });

  router.get(`/categories`, async (req, res) => {
    try {
      res.json(categories);
    } catch (err) {
      logger.error(`End request with error ${res.statusCode}`);
      sendResponse(res, HttpCode.NOT_FOUND, err);
    }
  });

  return router;
};

module.exports = api;
