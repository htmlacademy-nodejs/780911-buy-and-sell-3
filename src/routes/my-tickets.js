'use strict';

const {Router} = require(`express`);
const myTicketsRouter = new Router();

myTicketsRouter.get(`/`, (req, res) => res.render(`my-tickets`));

module.exports = myTicketsRouter;
