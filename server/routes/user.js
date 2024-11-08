const express = require("express");
const session = require("express-session");
const router = express.Router();

const db = require("../db/holomedia");
const tokenService = require("../module/jwt");

const uuid4 = require("uuid4");

// 로그인 프로세스
router.post("/login", function (request, response) {
  const user_id = request.body.user_id;
  const password = request.body.password;

  if (user_id && password) {
    // id와 pw가 입력되었는지 확인
    db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id],
      function (error, results, fields) {
        if (error) throw error;

        if (results.length === 0) {
          // user_id가 존재하지 않을 때
          return response
            .status(404)
            .send({message: "해당 아이디가 존재하지 않습니다.", status: 404});
        }

        // user_id가 존재할 경우 비밀번호 확인
        const user = results[0];

        if (user.password !== password) {
          // 비밀번호가 틀릴 때
          return response
            .status(400)
            .send({message: "비밀번호가 틀립니다.", status: 400});
        }
        // 로그인 성공
        request.session.is_logined = true; // 세션 정보 갱신
        request.session.nickname = user_id;

        response.status(200).send({
          message: "로그인이 완료되었습니다.",
          accessToken: tokenService.getToken(user_id),
          status: 200,
          username: user.username,
          is_adult_verified: user.is_adult_verified,
          is_admin: user.is_admin,
        });
      }
    );
  } else {
    response
      .status(400)
      .send({message: "아이디와 비밀번호를 입력하세요.", status: 400});
  }
});

// 로그아웃
router.post("/logout", function (request, response) {
  request.session.destroy((err) => {
    if (err) {
      return response
        .status(500)
        .send({message: "로그아웃 중 오류가 발생했습니다."});
    }
    response.status(200).send({message: "로그아웃되었습니다."});
  });
});

// 회원가입 프로세스
router.post("/signup", function (request, response) {
  const user_id = request.body.user_id;
  const password = request.body.password;
  const passwordCheck = request.body.passwordCheck;
  const username = request.body.username;

  if (user_id && password && passwordCheck && username) {
    // username 체크 추가
    // user_id 중복 확인
    db.query(
      "SELECT * FROM users WHERE user_id = ? OR username = ?", // user_id와 username 둘 다 확인
      [user_id, username],
      function (error, results, fields) {
        if (error) throw error;

        // user_id와 username 중복 확인
        if (results.length <= 0 && password === passwordCheck) {
          // DB에 같은 이름의 회원아이디와 닉네임이 없고, 비밀번호가 올바르게 입력된 경우
          db.query(
            "INSERT INTO users (user_id, password, username) VALUES(?,?,?)",
            [user_id, password, username],
            function (error, data) {
              if (error) throw error;
              response.status(200).send("회원가입이 완료되었습니다!");
            }
          );
        } else if (results.length > 0) {
          // user_id 또는 username이 이미 존재하는 경우
          if (results[0].user_id === user_id) {
            response.status(409).send("이미 존재하는 아이디 입니다.");
          } else if (results[0].username === username) {
            response.status(409).send("이미 존재하는 닉네임 입니다.");
          }
        } else if (password !== passwordCheck) {
          // 비밀번호가 올바르게 입력되지 않은 경우
          response.status(400).send("입력된 비밀번호가 서로 다릅니다.");
        }
      }
    );
  } else {
    // 입력되지 않은 정보가 있는 경우
    response.status(400).send("입력되지 않은 정보가 있습니다.");
  }
});

module.exports = router;
