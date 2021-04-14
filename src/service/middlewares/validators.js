"use strict";

const offerKeys = [
  `category`,
  `description`,
  `picture`,
  `title`,
  `type`,
  `sum`,
];
const {HttpCode} = require(`../../HttpCode`);
const {sendResponse} = require(`../../utils.js`);

const offerValidator = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    sendResponse(res, HttpCode.BAD_REQUEST, `Bad request`);
  }

  next();
};

const offerPutValidator = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.some((key) => keys.includes(key));

  if (!keysExists) {
    sendResponse(res, HttpCode.BAD_REQUEST, `no such fields in offer`);
  }

  next();
};

const commentValidator = (req, res, next) => {
  if (`text` in req.body) {
    next();
  } else {
    sendResponse(res, HttpCode.BAD_REQUEST, `invalid input`);
  }
};

module.exports = {
  offerValidator,
  commentValidator,
  offerPutValidator,
};
