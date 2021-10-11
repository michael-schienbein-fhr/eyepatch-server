"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WF } = require("../config.js");

/** Related functions for rooms. */

class Room {
  /** authenticate room with room_name and password.
   *
   * Returns { room_owner, room_name, room_members, video_queue, created_at }
   *
   * Throws UnauthorizedError is room not found or wrong password.
   **/

  static async authenticate(id, password) {
    // try to find the room first
    const result = await db.query(
      `SELECT id,
                room_owner AS "roomOwner",
                room_name AS "roomName",
                password,
                room_members AS "roomMembers",
                video_queue AS "videoQueue",
                created_at
          FROM rooms
          WHERE id = $1`,
      [id],
    );

    const room = result.rows[0];
    if (room) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, room.password.toString());
      if (isValid === true) {
        delete room.password;
        return room;
      }
    }

    throw new UnauthorizedError("Invalid Room Password");
  };

  /** Create room with data.
   *
   * Returns { room_owner, room_name, created_at }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async createRoom(
    { room_owner, room_name, password }) {
    let hashedPassword;
    let hasPass;

    const duplicateCheck = await db.query(
      `SELECT room_name
      FROM rooms
      WHERE room_name = $1`,
      [room_name],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate Room: ${room_name}`);
    }

    if (password === "") {
      hashedPassword = await bcrypt.hash(password, BCRYPT_WF);
      hasPass = false;
    };

    if (password !== null) {
      hashedPassword = await bcrypt.hash(password, BCRYPT_WF);
      hasPass = true;
    };

    const result = await db.query(
      `INSERT INTO rooms
           (room_owner, room_name, password, has_pass)
           VALUES ($1, $2, $3, $4)
           RETURNING id, room_owner AS roomOwner, room_name AS roomName, has_pass AS hasPass`,
      [
        room_owner,
        room_name,
        hashedPassword,
        hasPass
      ],
    );

    const room = result.rows[0];

    return room;
  };

  /** Find all rooms.
   *
   * Returns [{ room_owner, room_name, room_members, video_queue, created_at}, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id,
                  room_owner AS "roomOwner",
                  room_name AS "roomName",
                  room_members AS "roomMembers",
                  video_queue AS "videoQueue",
                  has_pass As "hasPass",
                  created_at
           FROM rooms
           ORDER BY created_at`,
    );

    return result.rows;
  };

  /** Given a room id, return data about room.
   *
   * Returns { room_owner, room_name, room_members, video_queue, created_at }
   *
   * Throws NotFoundError if room not found.
   **/

  static async get(id) {
    const roomRes = await db.query(
      `SELECT id,
              room_owner AS "roomOwner",
              room_name AS "roomName",
              room_members AS "roomMembers",
              video_queue AS "videoQueue",
              has_pass AS "hasPass",
              created_at
        FROM rooms
        WHERE id = $1`,
      [id],
    );

    const room = roomRes.rows[0];

    if (!room) throw new NotFoundError(`No Room ID: ${id}`);

    return room;
  };

  /** Given a room id, return data about newest single room.
   *
   * Returns { room_owner, room_name, room_members, video_queue, created_at }
   *
   * Throws NotFoundError if room not found.
   **/

  static async getNewest(id) {
    const roomRes = await db.query(
      `SELECT id,
              room_owner AS "roomOwner",
              room_name AS "roomName",
              room_members AS "roomMembers",
              video_queue AS "videoQueue",
              has_pass AS "hasPass",
              created_at
        FROM rooms
        ORDER BY id DESC
        LIMIT 1`
    );

    const room = roomRes.rows[0];

    if (!room) throw new NotFoundError(`No Room ID: ${id}`);

    return room;
  };

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */
  // UPDATE THIS
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WF);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin",
      });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given room from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
           FROM rooms
           WHERE id = $1
           RETURNING id`,
      [id],
    );
    const room = result.rows[0];

    if (!room) throw new NotFoundError(`No Room ID: ${id}`);
  }


}


module.exports = Room;
