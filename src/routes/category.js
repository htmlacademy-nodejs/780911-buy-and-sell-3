'use strict';

const {Router} = require(`express`);
const categoryRouter = new Router();

categoryRouter.get(`/`, (req, res) => res.render(`category`));

module.exports = categoryRouter;
