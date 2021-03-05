'use strict';

const {Router} = require(`express`);
const newTicketRouter = new Router();

newTicketRouter.get(`/`, (req, res) => res.render(`new-ticket`));

module.exports = newTicketRouter;
