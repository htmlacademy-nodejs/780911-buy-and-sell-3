"use strict";

const request = require(`supertest`);
const {server} = require(`./server`);
let app;

beforeEach(async () => {
  app = await server();
});

describe(`Books API end-points`, () => {
  test(`When get books status code should be 200`, async () => {
    const res = await request(app).get(`/api/offers`);

    expect(res.statusCode).toBe(200);
  });
});
