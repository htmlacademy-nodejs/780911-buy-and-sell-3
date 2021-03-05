"use strict";
const {Router} = require(`express`);
const Errors404Router = new Router();

Errors404Router.get(`/`, (req, res) => res.render(`404`));

module.exports = Errors404Router;
