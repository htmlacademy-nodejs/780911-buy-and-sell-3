"use strict";

const express = require(`express`);
const bodyParser = require(`body-parser`);
const app = express();
const DEFAULT_PORT = 3000;
const MOCK_FILE_PATH = `./mocks.json`;
const fs = require(`fs`).promises;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(/\n|\r/g).filter((item) => {
      return item.length > 0;
    });
  } catch (err) {
    console.error(err);
    return [];
  }
};

const returnHTML = (data) => {
  return data
    .map((item) => {
      return `<li>${item}</li>`;
    })
    .join(``);
};

const returnTitles = async (file) => {
  if (fs.existsSync(file)) {
    const mockData = await readContent(file);
    const arrMock = JSON.parse(mockData);
    return JSON.parse(arrMock).map((item) => {
      return item.title;
    });
  } else {
    console.log(`The file does not exist.`);
    return false;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const port = args ? Number.parseInt(args[0], 10) : DEFAULT_PORT;
    const titlesArr = await returnTitles(MOCK_FILE_PATH);
    app.use(bodyParser.json());

    app.get(`/`, (req, res) => {
      console.log(titlesArr);
      if (titlesArr) {
        res.send(`<ul>${returnHTML(titlesArr)}</ul>`);
      } else {
        res.status(404).send(`Not found`);
      }
    });

    app.listen(port, async (err) => {
      if (err) {
        return console.error(`Ошибка при создании http-сервера.`, err);
      }
      return console.info(`Принимаю подключения на ${port}`);
    });
  },
};
