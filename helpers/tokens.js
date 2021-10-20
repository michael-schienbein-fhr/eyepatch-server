const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createUserToken(user) {
  let payload = {
    type: "user",
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

function createRoomToken(room) {
  const passFlag = (room.haspass) ? true : false;

  let payload = {
    type: "room",
    id: room.id,
    roomOwner: room.roomOwner,
    roomName: room.roomName,
    passFlag
  };
  let signed = jwt.sign(payload, SECRET_KEY);

  return signed;
}

module.exports = { createUserToken, createRoomToken };
