"use strict"

require("dotenv").config();
require("colors");

const getDatabaseUri = () => {
  return (process.env.NODE_ENV === "test")
    ? "eyepatch_test"
    : process.env.DATABASE_URL || "eyepatch";
};

const PORT = +process.env.PORT || 3001;

const BCRYPT_WF = (process.env.NODE_ENV === "test")
  ? 1
  : 12;

const SECRET_KEY = process.env.SECRET_KEY || "secret-time";
const YOUTUBE_API_KEY = "AIzaSyCENEV9BsJUyuWII1H2JVZVSHt_yXpkUgo";

console.log("");
console.log("Eyepatch Api Server Config:".brightCyan);
console.log("NODE_ENV:".brightYellow, process.env.NODE_ENV);
console.log("PORT:".brightYellow, PORT.toString());
console.log("SECRET_KEY:".brightYellow, SECRET_KEY);
console.log("BCRYPT_WF:".brightYellow, BCRYPT_WF);
console.log("Database:".brightYellow, getDatabaseUri());
console.log("---------------------------------".brightCyan, "\n");



module.exports = {
  getDatabaseUri,
  PORT,
  SECRET_KEY,
  BCRYPT_WF,
  YOUTUBE_API_KEY
};
