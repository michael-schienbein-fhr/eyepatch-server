const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WF } = require("../config");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rooms");
  await db.query("ALTER SEQUENCE rooms_id_seq RESTART WITH 1");

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WF),
      await bcrypt.hash("password2", BCRYPT_WF),
    ]);
  await db.query(`
        INSERT INTO rooms(room_owner, 
                          room_name, 
                          password, 
                          has_pass)
        VALUES  ('u1', 'r1', $1, true),
                ('u2', 'r2', $2, false)
        RETURNING id, room_owner AS roomOwner, room_name AS roomName, has_pass AS hasPass`,
    [
      await bcrypt.hash("password1", BCRYPT_WF),
      null,
    ]);

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


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};