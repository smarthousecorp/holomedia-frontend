// 미들웨어: JWT 유효성 검사
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // 인증이 필요없는 경로 리스트
  const publicPaths = ["/uploaders", "/weekly"]; // 필요한 경로 추가

  // 현재 요청 경로가 publicPaths의 패턴과 일치하는지 확인
  const isPublicPath = publicPaths.some(
    (path) => req.path === path || req.path.startsWith(`${path}/`)
  );

  console.log(isPublicPath);

  // 공개 경로인 경우 인증 절차 건너뛰기
  if (isPublicPath) {
    return next();
  }

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send({message: "No token provided"});
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({message: "Token is invalid or expired"});
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken; // 모듈 내보내기
