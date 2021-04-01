"use strict";
const fs = require(`fs`).promises;
const fs2 = require(`fs`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }

  return someArray;
};

module.exports.returnCategories = async (file) => {
  const errMessage = `The file does not exist.`;
  try {
    if (fs2.existsSync(file)) {
      const mockData = await module.exports.readContent(file);

      return mockData;
    } else {
      console.log(errMessage);
      return false;
    }
  } catch (err) {
    console.log(errMessage);
    return false;
  }
};

module.exports.readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return JSON.parse(content);
  } catch (err) {
    console.error(err);
    return [];
  }
};

module.exports.generateOffers = (count, titles, categories, sentences, comments) => (

  Array(count).fill({}).map(() => ({
    id: nanoid(),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    comments: createCommentsList(comments, 5),
  }))
);
