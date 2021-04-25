"use strict";

const request = require(`supertest`);
const {run} = require(`./server`);

let app;
beforeEach(async () => {
  app = await run();
});

// afterAll(() => {
//   process.exit(0);
// });

describe(`Books API end-points`, () => {
  test(`When get books status code should be 200`, async () => {
    const res = await request(app).get(`/api/offers`);
    // console.log("res", res);
    expect(res.statusCode).toBe(200);
  });

  // test(`When get books status code should be 200`, async () => {
  //   const res = await request(server).get(`/api/books`);
  //   expect(res.statusCode).toBe(200);
  // });
});
