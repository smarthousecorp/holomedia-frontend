const geoip = require("geoip-lite");
const requestIp = require("request-ip");

const detectCountry = (req, res, next) => {
  try {
    // 클라이언트 IP 주소 가져오기
    let ip = requestIp.getClientIp(req);

    console.log("Original IP:", ip);
    console.log("Headers:", req.headers);

    // localhost 체크
    if (ip === "::1" || ip === "localhost" || ip === "127.0.0.1") {
      // ip = "1.34.1.1"; // 중국
      ip = "192.168.0.1"; // 중국
    }

    // IPv6 to IPv4 변환
    if (ip && ip.includes("::ffff:")) {
      ip = ip.split("::ffff:")[1];
    }

    console.log("Processed IP:", ip);

    // GeoIP 조회
    const geo = geoip.lookup(ip);
    console.log("GeoIP result:", geo);

    if (geo) {
      req.geoInfo = {
        country: geo.country,
        region: geo.region,
        timezone: geo.timezone,
      };
      console.log("GeoInfo set:", req.geoInfo);
    } else {
      console.log("No geo data found for IP:", ip);
    }
  } catch (error) {
    console.error("Error in detectCountry:", error);
  }
  next();
};

module.exports = {detectCountry};
