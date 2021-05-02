"use strict";

const request = require(`supertest`);
const {server} = require(`./server`);
const {readContentJSON, readContentTxt} = require(`../../../utils`);
const MOCK_FILE_PATH = `./mocks.json`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
let app;
let allOffersList;
beforeEach(async () => {
  app = await server();
  allOffersList = await readContentJSON(MOCK_FILE_PATH);
});

describe(`test api end-points`, () => {
  test(`When get books status code should be 200`, async () => {
    const res = await request(app).get(`/api/offers`);
    expect(res.statusCode).toBe(200);
  });

  test(`post offers return offer`, async () => {
    const data = {
      category: ["Животные"],
      description:
        "Товар в отличном состоянии. Предложение 1 Если товар не понравится — верну всё до последней копейки. Продаю с болью в сердце...",
      picture: "itemNaN.jpg",
      title: "Заголовок 2",
      type: "SALE",
      sum: 60523,
    };
    const res = await request(app).post(`/api/offers`).send(data);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(data.title);
    expect(res.body.sum).toBe(data.sum);
  });

  test(`get the post from the list`, async () => {
    const res = await request(app).get(`/api/offers/${allOffersList[0]["id"]}`);
    const falseRes = await request(app).get(`/api/offers/hohoho`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(allOffersList[0].title);
    expect(res.body.sum).toBe(allOffersList[0].sum);
    expect(falseRes.statusCode).toBe(404);
  });

  test(`edit the post from the list`, async () => {
    const allOffersList = await readContentJSON(MOCK_FILE_PATH);
    const data = {
      title: "hohoho",
      category: ["hohoho"],
    };
    const res = await request(app)
      .put(`/api/offers/${allOffersList[0]["id"]}`)
      .send(data);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(`hohoho`);
  });

  test(`edit the post from the list with not correct data`, async () => {
    const allOffersList = await readContentJSON(MOCK_FILE_PATH);

    const falsyData = {
      hohoho: "hohoho",
      categories: ["hohoho"],
    };

    const falseRes = await request(app)
      .put(`/api/offers/${allOffersList[0]["id"]}`)
      .send(falsyData);

    expect(falseRes.statusCode).toBe(400);
  });

  test(`delete the post from the list`, async () => {
    const res = await request(app).delete(
      `/api/offers/${allOffersList[0]["id"]}`
    );
    const falseRes = await request(app).delete(`/api/offers/hohoho`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(allOffersList.length - 1);
    expect(falseRes.statusCode).toBe(404);
  });

  test(`get comments of post by it's id`, async () => {
    const res = await request(app).get(
      `/api/offers/${allOffersList[0]["id"]}/comments`
    );
    const falseRes = await request(app).get(`/api/offers/hohoho/comments`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(allOffersList[0][`comments`].length);
    expect(falseRes.statusCode).toBe(404);
  });

  test(`delete comment of post by it's id`, async () => {
    const res = await request(app).delete(
      `/api/offers/${allOffersList[0]["id"]}/comments/${allOffersList[0]["comments"][0]["id"]}`
    );
    const falseRes = await request(app).delete(
      `/api/offers/${allOffersList[0]["id"]}/comments/${allOffersList[0]["comments"][0]}hohoho}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body[`comments`].length).toBe(
      allOffersList[0][`comments`].length - 1
    );
    expect(falseRes.statusCode).toBe(404);
  });

  test(`update comment of post by it's id`, async () => {
    const data = {
      text: "hohoho",
    };
    const falsyData = {
      hohoho: "hohoho",
    };

    const res = await request(app)
      .post(`/api/offers/${allOffersList[0]["id"]}/comments/`)
      .send(data);
    const falseRes = await request(app)
      .post(`/api/offers/${allOffersList[0]["id"]}/comments/`)
      .send(falsyData);

    expect(res.statusCode).toBe(200);
    expect(res.body[`comments`].length).toBe(
      allOffersList[0][`comments`].length + 1
    );
    expect(falseRes.statusCode).toBe(400);
  });

  test(`search for offer by a title`, async () => {
    const data = encodeURI(allOffersList[0]["title"]);
    const falsyData = "hohoho";

    const res = await request(app).get(`/api/search?query=${data}`);
    const falseRes = await request(app).get(`/api/search?query=${falsyData}`);

    expect(res.statusCode).toBe(200);
    expect(falseRes.statusCode).toBe(404);
  });

  test(`return categories list`, async () => {
    const categories = await readContentTxt(FILE_CATEGORIES_PATH);
    const res = await request(app).get(`/api/categories`);

    expect(res.statusCode).toBe(200);

    expect(res.body).toStrictEqual(categories);
  });
});
