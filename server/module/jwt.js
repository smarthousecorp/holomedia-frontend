// /src/module/jwt.js
const jwt = require("jsonwebtoken");
const {secretKey, accessTokenOption} = require("../config/jwtSetting");

const tokenService = {
  // payload에는 서비스마다 다르겠지만 필요한 최소한의 정보만 담는다.
  // 웬만하면 로그인한 사용자의 pk를 담는다.
  getToken(user) {
    const payload = {
      user_id: user,
    };

    return jwt.sign(payload, secretKey, accessTokenOption);
  },
  getPayload(token) {
    return jwt.verify(token, secretKey);
  },
};

module.exports = tokenService;
