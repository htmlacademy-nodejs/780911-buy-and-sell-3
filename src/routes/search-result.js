'use strict';

const {Router} = require(`express`);
const searchResultRouter = new Router();

searchResultRouter.get(`/`, (req, res) => res.render(`search-result`));

module.exports = searchResultRouter;
