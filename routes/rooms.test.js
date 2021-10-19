"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const Room = require("../models/room");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  u2Token,
  u3Token,
  r1Token,
  r2Token,
  r3Token,
  room1Id
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users */

// describe("GET /users", function () {
//   test("works for admins", async function () {
//     const resp = await request(app)
//       .get("/users")
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       users: [
//         {
//           username: "u1",
//           firstName: "U1F",
//           lastName: "U1L",
//           email: "user1@user.com",
//           isAdmin: false,
//         },
//         {
//           username: "u2",
//           firstName: "U2F",
//           lastName: "U2L",
//           email: "user2@user.com",
//           isAdmin: false,
//         },
//         {
//           username: "u3",
//           firstName: "U3F",
//           lastName: "U3L",
//           email: "user3@user.com",
//           isAdmin: false,
//         },
//       ],
//     });
//   });

//   test("unauth for non-admin users", async function () {
//     const resp = await request(app)
//       .get("/users")
//       .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .get("/users");
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("fails: test next() handler", async function () {
//     // there's no normal failure event which will cause this route to fail ---
//     // thus making it hard to test that the error-handler works with it. This
//     // should cause an error, all right :)
//     await db.query("DROP TABLE users CASCADE");
//     const resp = await request(app)
//       .get("/users")
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(500);
//   });
// });

// /************************************** GET /rooms/:id */

// describe("GET /rooms/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`)
//       .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("unauth for other users", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`)
//       .set("authorization", `Bearer ${u3Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if user not found", async function () {
//     const resp = await request(app)
//       .get(`/users/nope`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });


/************************************** DELETE /rooms/:id */

describe("DELETE /rooms/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/rooms/1`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ "deleted": "1" });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/rooms/2`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: "2" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete(`/rooms/1`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .delete(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
      .delete(`/users/nope`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

