const jwt = require("jsonwebtoken");
const { createUserToken, createRoomToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createUserToken", function () {
  test("works: not admin", function () {
    const token = createUserToken({ type: "user", username: "test", is_admin: false });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      type: "user",
      iat: expect.any(Number),
      username: "test",
      isAdmin: false,
    });
  });

  test("works: admin", function () {
    const token = createUserToken({ type: "user", username: "test", isAdmin: true });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      type: "user",
      iat: expect.any(Number),
      username: "test",
      isAdmin: true,
    });
  });

  test("works: default no admin", function () {
    // given the security risk if this didn't work, checking this specifically
    const token = createUserToken({ type: "user", username: "test" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      type: "user",
      iat: expect.any(Number),
      username: "test",
      isAdmin: false,
    });
  });
});

describe("createRoomToken", function () {
  test("works", function () {
    const token = createRoomToken({
      type: "room",
      id: 1,
      roomOwner: 'u1',
      roomName: 'r1',
      passFlag: false
    });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      "iat": expect.any(Number),
      "id": 1,
      "passFlag": false,
      "roomName": "r1",
      "roomOwner": "u1",
      "type": "room"
    }
    );
  });
});
