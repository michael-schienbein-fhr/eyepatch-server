"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  u2Token,
  u3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /rooms */

describe("POST /rooms", function () {
  test("works for admins: create room", async function () {
    const resp = await request(app)
      .post("/rooms")
      .send({
        room_owner: "u1",
        room_name: "testroom",
        password: "testpassword"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "room": {
        "haspass": true,
        "id": 4,
        "roomname": "testroom",
        "roomowner": "u1",
      },
      "token": expect.any(String),

    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post("/rooms")
      .send({
        room_owner: "u2",
        room_name: "testroom",
        password: "testpassword"
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post("/rooms")
      .send({
        room_owner: "u3",
        room_name: "testroom",
        password: "testpassword"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/rooms")
      .send({
        room_owner: "u1",
        password: "testpassword"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/rooms")
      .send({
        room_owner: "u1",
        room_name: "",
        password: "1"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /rooms */

describe("GET /rooms", function () {
  test("works for admins", async function () {
    const resp = await request(app)
      .get("/rooms")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      "rooms": [
        {
          "created_at": expect.any(String),
          "hasPass": true,
          "id": 1,
          "roomMembers": null,
          "roomName": "room1",
          "roomOwner": "u1",
          "videoQueue": null,
        },
        {
          "created_at": expect.any(String),
          "hasPass": true,
          "id": 2,
          "roomMembers": null,
          "roomName": "room2",
          "roomOwner": "u2",
          "videoQueue": null,
        },
        {
          "created_at": expect.any(String),
          "hasPass": false,
          "id": 3,
          "roomMembers": null,
          "roomName": "room3",
          "roomOwner": "u3",
          "videoQueue": null,
        },
      ],
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

// /************************************** GET /rooms/:id */

describe("GET /rooms/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/rooms/1`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      room: {
        "created_at": expect.any(String),
        "hasPass": true,
        "id": 1,
        "roomMembers": null,
        "roomName": "room1",
        "roomOwner": "u1",
        "videoQueue": null,
      },
    });
  });

  test("works for creator", async function () {
    const resp = await request(app)
      .get(`/rooms/2`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      room: {
        "created_at": expect.any(String),
        "hasPass": true,
        "id": 2,
        "roomMembers": null,
        "roomName": "room2",
        "roomOwner": "u2",
        "videoQueue": null,
      },
    });
  });

  test("works for other users", async function () {
    const resp = await request(app)
      .get(`/rooms/2`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.body).toEqual({
      room: {
        "created_at": expect.any(String),
        "hasPass": true,
        "id": 2,
        "roomMembers": null,
        "roomName": "room2",
        "roomOwner": "u2",
        "videoQueue": null,
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(`/rooms/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if room not found", async function () {
    const resp = await request(app)
      .get(`/rooms/99999999`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("invalid input", async function () {
    const resp = await request(app)
      .get(`/rooms/nope`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
    expect(resp.body).toEqual({
      "error": {
        "message": "invalid input syntax for type integer: \"nope\"",
        "status": 500
      }
    })
  });
});
/************************************** GET /rooms/newest */
describe("GET /rooms/newest", function () {
  test("works for admins", async function () {
    const resp = await request(app)
      .get("/rooms/newest")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      "room": {
        "created_at": expect.any(String),
        "hasPass": false,
        "id": 3,
        "roomMembers": null,
        "roomName": "room3",
        "roomOwner": "u3",
        "videoQueue": null,
      },
    });
  });

  test("works for other users", async function () {
    const resp = await request(app)
      .get(`/rooms/newest`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.body).toEqual({
      "room": {
        "created_at": expect.any(String),
        "hasPass": false,
        "id": 3,
        "roomMembers": null,
        "roomName": "room3",
        "roomOwner": "u3",
        "videoQueue": null,
      },
    });
  });
});

test("not found if room missing", async function () {
  const resp = await request(app)
    .delete(`/rooms/newest/room`)
    .set("authorization", `Bearer ${adminToken}`);
  expect(resp.statusCode).toEqual(404);
});
/************************************** DELETE /rooms/:id */

describe("DELETE /rooms/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/rooms/1`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ "deleted": "1" });
  });

  test("works for creator", async function () {
    const resp = await request(app)
      .delete(`/rooms/2`)
      .send({
        username: "u2",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: "2" });
  });

  test("unauth if not creator", async function () {
    const resp = await request(app)
      .delete(`/rooms/1`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/rooms/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if room missing", async function () {
    const resp = await request(app)
      .delete(`/rooms/99999999`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("invalid input", async function () {
    const resp = await request(app)
      .get(`/rooms/nope`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
    expect(resp.body).toEqual({
      "error": {
        "message": "invalid input syntax for type integer: \"nope\"",
        "status": 500
      }
    })
  });
});

