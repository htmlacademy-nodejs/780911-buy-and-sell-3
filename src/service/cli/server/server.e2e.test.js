"use strict";

const request = require(`supertest`);
const {run} = require(`./server`);
let app;

beforeEach(async () => {
  app = await run();
});

describe(`Books API end-points`, () => {
  test(`When get books status code should be 200`, async () => {
    const res = await request(app).get(`/api/offers`);

    expect(res.statusCode).toBe(200);
  });
});
