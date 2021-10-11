const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createUserToken(user) {
  console.assert(user.isAdmin !== undefined,
    "createToken passed user without isAdmin property");

  let payload = {
    type: "user",
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

function createRoomToken(room) {
  // console.assert(room.password !== undefined,
  //     "createRoomToken passed new room without password property");
  const passFlag = (room.haspass) ? true : false;

  let payload = {
    type: "room",
    id: room.id,
    roomOwner: room.roomOwner,
    roomName: room.roomName,
    passFlag
  };
  // console.debug(room, "WHAT THE FUCK")
  // console.debug(payload, "PLEASE OH GOD");
  let signed = jwt.sign(payload, SECRET_KEY);

  return signed;
}

module.exports = { createUserToken, createRoomToken };
