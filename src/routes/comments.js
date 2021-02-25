'use strict';

const {Router} = require(`express`);
const commentsRouter = new Router();

commentsRouter.get(`/`, (req, res) => res.render(`comments`));

module.exports = commentsRouter;
