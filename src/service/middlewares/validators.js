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

const offerValidator = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  next();
};

const offerPutValidator = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.some((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  next();
};

const commentValidator = (req, res, next) => {
  if (`text` in req.body) {
    next();
  }
};

module.exports = {
  offerValidator,
  commentValidator,
  offerPutValidator
};
