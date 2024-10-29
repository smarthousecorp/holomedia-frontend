// ../../config/jwtSetting.js
const secretKey = process.env.JWT_SECRET_KEY || "your-default-secret-key"; // 환경변수에서 비밀 키를 가져오거나 기본값 설정
const accessTokenOption = {
  algorithm: "HS256", // 사용할 알고리즘
  expiresIn: "1h", // 토큰의 유효기간
  issuer: "inko51366.com", // 토큰 발행자
};

module.exports = {
  secretKey,
  accessTokenOption,
};
