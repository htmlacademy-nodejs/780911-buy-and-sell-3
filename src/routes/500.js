"use strict";

const {Router} = require(`express`);
const Errors500Router = new Router();

Errors500Router.get(`/`, (req, res) => res.render(`500`));

module.exports = Errors500Router;
