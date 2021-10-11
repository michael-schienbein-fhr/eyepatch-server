"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const Room = require("../models/room");
const express = require("express");
const router = new express.Router();
const { createUserToken, createRoomToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const roomAuthSchema = require("../schemas/roomAuth.json");
const roomCreateSchema = require("../schemas/roomCreate.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token/user:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token/user", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const userToken = createUserToken(user);
    return res.json({ userToken });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const userToken = createUserToken(newUser);
    return res.status(201).json({ userToken });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/token/room:  { id, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token/room", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, roomAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { id, password } = req.body;
    const room = await Room.authenticate(id, password);
    const roomToken = createRoomToken(room);
    return res.json({ roomToken });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/create:   { room } => { token }
 *
 * room must include { roomOwner, roomName } password optional
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/create", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, roomCreateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newRoom = await Room.createRoom({ ...req.body });
    const roomToken = createRoomToken(newRoom);
    return res.status(201).send({ roomToken });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
