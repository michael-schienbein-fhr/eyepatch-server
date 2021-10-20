"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token/user */

describe("POST /auth/token/user", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/token/user")
      .send({
        username: "u5",
        password: "password5",
      });
    expect(resp.body).toEqual({
      "userToken": expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
      .post("/auth/token/user")
      .send({
        username: "no-such-user",
        password: "password1",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/token/user")
      .send({
        username: "u1",
        password: "nope",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/auth/token/user")
      .send({
        username: "u1",
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/token/user")
      .send({
        username: 42,
        password: "above-is-a-number",
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for anon", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
        firstName: "first",
        lastName: "last",
        password: "password",
        email: "new@email.com",
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "userToken": expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
        firstName: "first",
        lastName: "last",
        password: "password",
        email: "not-an-email",
      });
    expect(resp.statusCode).toEqual(400);
  });
});
/************************************** POST /auth/token/room */

describe("POST /auth/token/room", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/token/room")
      .send({
        id: 1,
        password: "password1"
      });
    expect(resp.body).toEqual({
      "roomToken": expect.any(String),
    });
  });

  test("unauth with non-existent room", async function () {
    const resp = await request(app)
      .post("/auth/token/room")
      .send({
        id: 9999,
        password: "password1"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/token/room")
      .send({
        id: 1,
        password: "nope"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/auth/token/room")
      .send({
        id: 1
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/token/room")
      .send({
        id: "one",
        password: "above-is-a-number",
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/create */

describe("POST /auth/create", function () {
  test("works for anon", async function () {
    const resp = await request(app)
      .post("/auth/create")
      .send({
        room_owner: "u1",
        room_name: "testroom",
        password: "password1"        
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "roomToken": expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
      .post("/auth/create")
      .send({
        password: "testpassword"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/create")
      .send({
        room_owner: "",
        room_name: "testroom",
        password: ""  
      });
    expect(resp.statusCode).toEqual(400);
  });
});
