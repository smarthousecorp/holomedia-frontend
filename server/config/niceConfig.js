// config/niceConfig.js
require("dotenv").config();

module.exports = {
  clientId: process.env.NICE_CLIENT_ID,
  clientSecret: process.env.NICE_CLIENT_SECRET,
  productId: process.env.NICE_PRODUCT_ID,
  baseUrl: "https://svc.niceapi.co.kr:22001",
};
