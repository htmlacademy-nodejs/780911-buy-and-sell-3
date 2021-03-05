"use strict";

const express = require(`express`);
const path = require(`path`);
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `./express/public`;

const categoryRoutes = require(`./routes/category`);
const commentsRoutes = require(`./routes/comments`);
const mainRoutes = require(`./routes/main`);
const myTicketsRoutes = require(`./routes/my-tickets`);
const loginRoutes = require(`./routes/login`);
const newTicketRoutes = require(`./routes/new-ticket`);
const searchResultRoutes = require(`./routes/search-result`);
const signUpRoutes = require(`./routes/sign-up`);
const ticketRoutes = require(`./routes/ticket`);
const ticketEditRoutes = require(`./routes/ticket-edit`);
const Errors500Routes = require(`./routes/500`);

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `./express/templates`));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/category`, categoryRoutes);
app.use(`/comments`, commentsRoutes);
app.use(`/main`, mainRoutes);
app.use(`/my-tickets`, myTicketsRoutes);
app.use(`/login`, loginRoutes);
app.use(`/new-ticket`, newTicketRoutes);
app.use(`/search-result`, searchResultRoutes);
app.use(`/sign-up`, signUpRoutes);
app.use(`/ticket`, ticketRoutes);
app.use(`/ticket-edit`, ticketEditRoutes);

app.get(`/`, (req, res) => res.render(`index`));

app.use(function (req, res) {
  res.status(404);
  res.render(`404`);
});
app.use(`/500`, Errors500Routes);

app.listen(DEFAULT_PORT, () =>
  console.log(`Сервер запущен на порту: ${DEFAULT_PORT}`)
);
