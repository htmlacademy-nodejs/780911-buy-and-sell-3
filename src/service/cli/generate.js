"use strict";

const fs = require(`fs`).promises;
const {generateOffers, readContentTxt} = require(`../../utils`);
const chalk = require(`chalk`);
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContentTxt(FILE_SENTENCES_PATH);
    const titles = await readContentTxt(FILE_TITLES_PATH);
    const categories = await readContentTxt(FILE_CATEGORIES_PATH);
    const comments = await readContentTxt(FILE_COMMENTS_PATH);
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(
      generateOffers(countOffer, titles, categories, sentences, comments)
    );

    if (countOffer > 999) {
      console.log(chalk.red(`Не больше 1000 объявлений`));
      process.exit(1);
    }

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
