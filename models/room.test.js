"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Room = require("./room.js");
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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const room = await Room.authenticate(4, "password1");
    expect(room).toEqual({
      "created_at": expect.anything(),
      "id": 4,
      "roomMembers": null,
      "roomName": "r4",
      "roomOwner": "u4",
      "videoQueue": null
    });
  });

  test("unauth if no such room", async function () {
    try {
      await Room.authenticate(99999999, "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await Room.authenticate(4, "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** createRoom */

describe("createRoom", function () {
  const newRoom = {
    room_owner: "u4",
    room_name: "r6",
    password: "password"
  };

  test("works", async function () {
    let room = await Room.createRoom({
      ...newRoom
    });
    expect(room).toEqual({
      "haspass": true,
      "id": 6,
      "roomname": "r6",
      "roomowner": "u4",
    });
    const found = await db.query("SELECT * FROM rooms WHERE id = 6");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].has_pass).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dupe data", async function () {
    try {
      await Room.createRoom({
        ...newRoom,
        password: "password",
      });
      await Room.createRoom({
        ...newRoom,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const rooms = await Room.findAll();
    expect(rooms).toEqual([
      {
        "created_at": expect.anything(),
        "hasPass": true,
        "id": 4,
        "roomMembers": null,
        "roomName": "r4",
        "roomOwner": "u4",
        "videoQueue": null
      },
      {
        "created_at": expect.anything(),
        "hasPass": false,
        "id": 5,
        "roomMembers": null,
        "roomName": "r5",
        "roomOwner": "u5",
        "videoQueue": null
      }
    ]);
  });
});

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    let room = await Room.get(4);
    expect(room).toEqual({
      "created_at": expect.anything(),
      "hasPass": true,
      "id": 4,
      "roomMembers": null,
      "roomName": "r4",
      "roomOwner": "u4",
      "videoQueue": null
    });
  });

  test("not found if no such room", async function () {
    try {
      await Room.get(99999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** getNewest */
describe("get", function () {
  test("works", async function () {
    let room = await Room.getNewest();
    expect(room).toEqual({
      "created_at": expect.anything(),
      "hasPass": false,
      "id": 5,
      "roomMembers": null,
      "roomName": "r5",
      "roomOwner": "u5",
      "videoQueue": null
    });
  });
});
// /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Room.remove(5);
    const res = await db.query(
      "SELECT * FROM rooms WHERE id = 5");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such room", async function () {
    try {
      await Room.remove(99999999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
