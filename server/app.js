const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const mediaRouter = require("./routes/media");
const userRouter = require("./routes/user");

const app = express();

app.use(
  session({
    secret: "your-secret-key", // 비밀 키
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}, // HTTPS를 사용할 경우 true로 설정
  })
);

app.use(cors());
app.use(express.json());

// Pug 템플릿 엔진 설정
app.use(express.static(path.join(__dirname, "public")));

app.use("/media", mediaRouter);
app.use("/", userRouter);

module.exports = app;
