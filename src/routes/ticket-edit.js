'use strict';

const {Router} = require(`express`);
const ticketEditRouter = new Router();

ticketEditRouter.get(`/`, (req, res) => res.render(`ticket-edit`));

module.exports = ticketEditRouter;
