"use strict";
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const createCommentsList = (arr, length) => {
  const commentsArr = [];

  for (let i = 0; i < length; i++) {
    commentsArr[i] = {id: nanoid(), text: arr[getRandomInt(0, arr.length)]};
  }
  return commentsArr;
};

const createComment = (text) => {
  return {id: nanoid(), text};
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }

  return someArray;
};

const zeroFill = (numb, zerosAmount) => {
  zerosAmount -= numb.toString().length;
  if (zerosAmount > 0) {
    return new Array(zerosAmount + (/\./.test(numb) ? 2 : 1)).join(`0`) + numb;
  }
  return numb + ``;
};

const getPictureFileName = (num1, num2) => {
  return `item${zeroFill(getRandomInt(num1, num2), 2)}.jpg`;
};

const readContentJSON = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return JSON.parse(content);
  } catch (err) {
    console.error(`readContentJSON`, filePath, err);
    return [];
  }
};

const readContentTxt = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(/\n|\r/g).filter((item) => {
      return item.length > 0;
    });
  } catch (err) {
    console.error(`readContentTxt`, filePath, err);
    return [];
  }
};

const createOffer = (offer) => {
  return Object.assign({id: nanoid(), comments: []}, offer);
};

const generateOffers = (count, titles, categories, sentences, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(),
      category: [categories[getRandomInt(0, categories.length - 1)]],
      description: shuffle(sentences).slice(1, 5).join(` `),
      picture: getPictureFileName(
          getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
      ),
      title: titles[getRandomInt(0, titles.length - 1)],
      type: Object.keys(OfferType)[
        Math.floor(Math.random() * Object.keys(OfferType).length)
      ],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
      comments: createCommentsList(comments, 5),
    }));

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

module.exports = {
  sendResponse,
  generateOffers,
  readContentTxt,
  readContentJSON,
  shuffle,
  getRandomInt,
  zeroFill,
  getPictureFileName,
  createCommentsList,
  createOffer,
  createComment
};
