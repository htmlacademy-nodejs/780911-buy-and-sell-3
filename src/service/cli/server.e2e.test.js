"use strict";

const request = require(`supertest`);
const server = require(`./server`);


describe(`Books API end-points`, () => {
  // Тестовые кейсы


  test(`When get books status code should be 200`, async () => {
    const res = await request(server).get(`/api/offers`);
    expect(res.statusCode).toBe(200);
  });

});
