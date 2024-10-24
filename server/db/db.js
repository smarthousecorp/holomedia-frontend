require("dotenv").config();

const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.DB_HOST, // .env에서 가져온 호스트
  port: process.env.DB_PORT, // .env에서 가져온 포트
  user: process.env.DB_USER, // .env에서 가져온 사용자
  password: process.env.DB_PASSWORD, // .env에서 가져온 비밀번호
  database: "users",
});

db.connect();

module.exports = db;
