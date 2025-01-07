const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const mediaRouter = require("./routes/media");
const userRouter = require("./routes/user");
const niceAuthRouter = require("./routes/niceAuthRoute");

const app = express();

app.use(
  session({
    secret: "your-secret-key", // 비밀 키
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // HTTPS를 사용할 경우 true로 설정
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only use secure in production
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    // credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pug 템플릿 엔진 설정
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);
app.use("/media", mediaRouter);
app.use("/api/nice/auth", niceAuthRouter);

module.exports = app;
