"use strict";

/** Routes for rooms. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Room = require('../models/room');
const { createRoomToken } = require("../helpers/tokens");
const roomNewSchema = require("../schemas/roomNew.json");

const router = express.Router();

// admin route for adding a room
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

// get all rooms
router.get("/", async function (req, res, next) {
  try {
    const rooms = await Room.findAll();
    return res.json({ rooms });
  } catch (err) {
    return next(err);
  }
});

// gets the most recent room 
router.get("/newest", async function (req, res, next) {
  try {
    const room = await Room.getNewest();
    return res.json({ room });
  } catch (err) {
    return next(err);
  }
});

// gets room by id
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const room = await Room.get(req.params.id);
    console.log(room);
    return res.json({ room });
  } catch (err) {
    return next(err);
  }
});

// deletes room by id
router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await Room.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;
