'use strict';

const {Router} = require(`express`);
const ticketRouter = new Router();

ticketRouter.get(`/`, (req, res) => res.render(`ticket`));

module.exports = ticketRouter;
