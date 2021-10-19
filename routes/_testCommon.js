"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Room = require("../models/room");
const { createUserToken, createRoomToken } = require("../helpers/tokens");

// const testRoomIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rooms");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: true,
  })
  

  let u2 = await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  const u2Token = createUserToken(u2);

  let u3 = await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  })
  const u3Token = createUserToken(u3);

  let r1 = await Room.createRoom(
    {
      room_owner: "u1",
      room_name: "room1",
      password: "password1"
    });
  const r1Token = createRoomToken(r1);

  let r2 = await Room.createRoom(
    {
      room_owner: "u2",
      room_name: "room2",
      password: "password2"
    });
  const r2Token = createRoomToken(r2);

  let r3 = await Room.createRoom(
    {
      room_owner: "u3",
      room_name: "room3",
      password: ""
    });
  const r3Token = createRoomToken(r3);


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

const adminToken = createUserToken({username: "u1",
firstName: "U1F",
lastName: "U1L",
email: "user1@user.com",
password: "password1",
isAdmin: true,});



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
