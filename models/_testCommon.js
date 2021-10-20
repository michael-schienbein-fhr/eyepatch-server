const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WF } = require("../config");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query("ALTER SEQUENCE rooms_id_seq RESTART WITH 4");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rooms");
  await db.query("ALTER SEQUENCE rooms_id_seq RESTART WITH 4");

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u4', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u5', $2, 'U2F', 'U2L', 'u2@email.com')
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
        VALUES  ('u4', 'r4', $1, true),
                ('u5', 'r5', $2, false)
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