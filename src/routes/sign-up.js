'use strict';

const {Router} = require(`express`);
const signUpRouter = new Router();

signUpRouter.get(`/`, (req, res) => res.render(`sign-up`));

module.exports = signUpRouter;
