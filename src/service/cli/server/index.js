"use strict";

const {server} = require(`./server`);
const DEFAULT_PORT = 3000;
const chalk = require(`chalk`);

const name = `--server`;
let app;
const run = async (args) => {
  app = await server();
  const port = args ? Number.parseInt(args[0], 10) : DEFAULT_PORT;

  app.listen(port, (err) => {
    if (err) {
      return console.error(`Ошибка при создании сервера`, err);
    }
    return console.info(chalk.green(`Ожидаю соединений на ${port}`));
  });
};

module.exports = {
  name,
  run,
};
