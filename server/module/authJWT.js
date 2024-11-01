// 미들웨어: JWT 유효성 검사
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]; // Bearer 토큰에서 실제 토큰 추출
  console.log(token);

  if (!token) {
    return res.status(401).send({message: "No token provided"});
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({message: "Token is invalid or expired"});
    }
    req.user = user; // 유효한 경우 사용자 정보를 요청 객체에 추가
    next();
  });
};

module.exports = authenticateToken; // 모듈 내보내기
