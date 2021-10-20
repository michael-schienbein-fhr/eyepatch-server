"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Room = require("../models/room");
const { createUserToken, createRoomToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query("ALTER SEQUENCE rooms_id_seq RESTART WITH 1")
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rooms");
  await db.query("ALTER SEQUENCE rooms_id_seq RESTART WITH 1")

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: true,
  })

  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });

  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  })

  await Room.createRoom(
    {
      room_owner: "u1",
      room_name: "room1",
      password: "password1"
    });

  await Room.createRoom(
    {
      room_owner: "u2",
      room_name: "room2",
      password: "password2"
    });

  await Room.createRoom(
    {
      room_owner: "u3",
      room_name: "room3",
      password: ""
    });



}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const adminToken = createUserToken({
  username: "u1",
  isAdmin: true
});
const u2Token = createUserToken({
  username: "u2",
  isAdmin: false
});
const u3Token = createUserToken({
  username: "u3",
  isAdmin: false
});
const r1Token = createRoomToken({
  id: 1,
  roomOwner: 'u1',
  roomName: 'room1',
  hasPass: true,
});
const r2Token = createRoomToken({
  id: 2,
  roomOwner: 'u2',
  roomName: 'room2',
  hasPass: true,
});
const r3Token = createRoomToken({
  id: 3,
  roomOwner: 'u3',
  roomName: 'room3',
  hasPass: false,
});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  u2Token,
  u3Token,
  r1Token,
  r2Token,
  r3Token
};
