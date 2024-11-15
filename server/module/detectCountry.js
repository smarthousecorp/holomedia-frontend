const geoip = require("geoip-lite");

const detectCountry = (req, res, next) => {
  // 클라이언트 IP 주소 가져오기
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "";
  console.log(ip);

  // 개발 환경에서 테스트를 위한 더미 IP
  const testIP = process.env.NODE_ENV === "development" ? "8.8.8.8" : ip;

  try {
    const geo = geoip.lookup(testIP);
    if (geo) {
      req.geoInfo = {
        country: geo.country,
        region: geo.region,
        timezone: geo.timezone,
      };
    }
  } catch (error) {
    console.error("Error detecting country:", error);
  }
  next();
};

module.exports = {detectCountry};
