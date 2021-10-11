"use strict";

/** Routes for rooms. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureRoomLoggedIn, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Room = require('../models/room');
const { createRoomToken } = require("../helpers/tokens");
const roomNewSchema = require("../schemas/roomNew.json");
// const roomUpdateSchema = require("../schemas/roomUpdate.json");

const router = express.Router();


/** POST / { room }  => { room, token }
 *
 * Adds a new room. This is not the registration endpoint --- instead, this is
 * only for admin users to add new rooms. 
 * 
 *
 * This returns the newly created room and an authentication token for them:
 *  {room: { id, roomOwner, roomName, hasPass }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, roomNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const room = await Room.createRoom(req.body);
    const token = createRoomToken(room);
    return res.status(201).json({ room, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", async function (req, res, next) {
  try {
    const rooms = await Room.findAll();
    return res.json({ rooms });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/newest", async function (req, res, next) {
  try {
    const room = await Room.getNewest();
    return res.json({ room });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const room = await Room.get(req.params.id);
    return res.json({ room });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:id/private", ensureRoomLoggedIn, async function (req, res, next) {
  try {
    const room = await Room.get(req.params.id);
    return res.json({ room });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

// router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(req.body, roomUpdateSchema);
//     if (!validator.valid) {
//       const errs = validator.errors.map(e => e.stack);
//       throw new BadRequestError(errs);
//     }

//     const user = await User.update(req.params.username, req.body);
//     return res.json({ user });
//   } catch (err) {
//     return next(err);
//   }
// });


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

// router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
//   try {
//     await User.remove(req.params.username);
//     return res.json({ deleted: req.params.username });
//   } catch (err) {
//     return next(err);
//   }
// });



module.exports = router;
