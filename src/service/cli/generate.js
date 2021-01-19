'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const chalk = require(`chalk`);
const titles = `../../../data/titles.txt`;
const sentences = `../../../data/sentences.txt`;
const categories = `../../../data/categories.txt`;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

// const TITLES = [
//   `Продам книги Стивена Кинга`,
//   `Продам новую приставку Sony Playstation 5`,
//   `Продам отличную подборку фильмов на VHS`,
//   `Куплю антиквариат`,
//   `Куплю породистого кота`,
// ];
//
// const SENTENCES = [
//   `Товар в отличном состоянии.`,
//   `Пользовались бережно и только по большим праздникам.`,
//   `Продаю с болью в сердце...`,
//   `Бонусом отдам все аксессуары.`,
//   `Даю недельную гарантию.`,
//   `Если товар не понравится — верну всё до последней копейки.`,
//   `Это настоящая находка для коллекционера!`,
//   `Если найдёте дешевле — сброшу цену.`,
//   `Таких предложений больше нет!`,
//   `При покупке с меня бесплатная доставка в черте города.`,
// ];
//
// const CATEGORIES = [
//   `Книги`,
//   `Разное`,
//   `Посуда`,
//   `Игры`,
//   `Животные`,
//   `Журналы`,
// ];

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

const zeroFill = (number, width) => {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join(`0`) + number;
  }
  return number + ``;
};

const getPictureFileName = (num1, num2) => {
  return `item${zeroFill(getRandomInt(num1, num2), 2)}.jpg`;
};

async function readFile(fileName) {
    try {
      const file = fs.readFile(path.resolve(__dirname, fileName), `utf-8`);
      return file;

    } catch (e) {
      console.log("e", e);
    }
}

// const generateOffers = (count) => (
//   Array(count).fill({}).map(() => ({
//     category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
//     description: shuffle(SENTENCES).slice(1, 5).join(` `),
//     picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX), 2),
//     title: TITLES[getRandomInt(0, TITLES.length - 1)],
//     type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
//     sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
//   }))
// );

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    //const content = JSON.stringify(generateOffers(countOffer));

    if (countOffer > 999) {
      console.log(chalk.red(`Не больше 1000 объявлений`));
      process.exit(1);
    }

    try {
      const res = await readFile(titles);
      console.log(res.split("\n"));
      await fs.writeFile(FILE_NAME, JSON.stringify('content'));
      console.log(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
