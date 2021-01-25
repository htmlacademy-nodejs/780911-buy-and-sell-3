"use strict";

const express = require(`express`);
const bodyParser = require(`body-parser`);
const app = express();
const port = 3000;
const FILE_TITLES_PATH = `./data/titles.txt`;
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
const tasks = [
  {
    id: 1,
    task: `task1`,
    assignee: `assignee1000`,
    status: `completed`,
  },
  {
    id: 2,
    task: `task2`,
    assignee: `assignee1001`,
    status: `completed`,
  },
  {
    id: 3,
    task: `task3`,
    assignee: `assignee1002`,
    status: `completed`,
  },
  {
    id: 4,
    task: `task4`,
    assignee: `assignee1000`,
    status: `completed`,
  },
];

module.exports = {
  name: `--server`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    app.use(bodyParser.json());

    app.get(`/api/todos`, (req, res) => {
      console.log(`api/todos called!`);
      res.json(tasks);
    });

    app.get(`/`, (req, res) => {
      res.send(`<ul>${returnHTML(titles)}</ul>`);
    });

    app.listen(port, async () => {
      console.log(
        `Server listening on the port::${port}  ${returnHTML(titles)}`
      );
    });
  },
};
