// ../../config/jwtSetting.js
const secretKey = process.env.ACCESS_TOKEN_SECRET || "your-default-secret-key"; // 환경변수에서 비밀 키를 가져오거나 기본값 설정
const accessTokenOption = {
  algorithm: "HS256", // 사용할 알고리즘
  expiresIn: "1d", // 토큰의 유효기간
};

module.exports = {
  secretKey,
  accessTokenOption,
};
