"use strict";

const request = require(`supertest`);
const server = require(`./server`);

describe(`Books API end-points`, async () => {

  test(`When get books status code should be 200`, async (done) => {
    const res = await request(server).get(`/api/offers`).expect(200, done);
  });
});
