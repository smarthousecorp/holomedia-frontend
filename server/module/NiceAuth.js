// module/NiceAuth.js
const crypto = require("crypto");
const axios = require("axios");
const qs = require("querystring");
const NiceCrypto = require("./NiceCrypto");
const niceConfig = require("../config/niceConfig");

class NiceAuth {
  constructor() {
    this.clientId = niceConfig.clientId;
    this.clientSecret = niceConfig.clientSecret;
    this.productId = niceConfig.productId;
    this.baseUrl = niceConfig.baseUrl;
  }

  // module/NiceAuth.js의 클래스에 추가
  async getAccessToken() {
    try {
      const authorization = Buffer.from(
        this.clientId + ":" + this.clientSecret
      ).toString("base64");

      const dataBody = {
        scope: "default",
        grant_type: "client_credentials",
      };

      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/digital/niceid/oauth/oauth/token`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authorization}`,
        },
        data: qs.stringify(dataBody),
      });

      return response.data.dataBody.access_token;
    } catch (error) {
      console.error("getAccessToken Error:", error);
      throw error;
    }
  }

  async requestCertification(token, reqData) {
    try {
      const nowDate = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
      };

      const req_dtim = formatDate(tomorrow);
      const req_no = crypto.randomBytes(16).toString("hex").slice(0, 30);
      const current_timestamp = Math.floor(nowDate.getTime() / 1000);

      // Authorization 헤더 구성
      const authString = `${token}:${current_timestamp}:${this.clientId}`;
      const authorization = `bearer ${Buffer.from(authString).toString(
        "base64"
      )}`;

      console.log("[Debug] Request payload:", {
        req_dtim,
        req_no,
        enc_mode: "1",
      });

      const tokenResponse = await axios.post(
        `${this.baseUrl}/digital/niceid/api/v1.0/common/crypto/token`,
        {
          dataHeader: { CNTY_CD: "ko" },
          dataBody: { req_dtim, req_no, enc_mode: "1" },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
            ProductID: this.productId,
          },
        }
      );

      console.log("[Debug] Token Response:", tokenResponse.data);

      const { token_val } = tokenResponse.data.dataBody;

      if (!req_dtim || !req_no || !token_val) {
        throw new Error(
          "Required values are missing: " +
            `req_dtim: ${!!req_dtim}, ` +
            `req_no: ${!!req_no}, ` +
            `token_val: ${!!token_val}`
        );
      }

      // 대칭키 생성
      const value = `${req_dtim.trim()}${req_no.trim()}${token_val.trim()}`;

      // SHA-256 해시 생성
      const hash = crypto.createHash("sha256").update(value).digest();

      // key는 앞에서부터 32바이트 (AES-256-CBC용)
      const key = hash.slice(0, 32);

      // iv는 뒤에서부터 16바이트
      const iv = hash.slice(-16);

      // hmac_key는 전체 해시값 사용
      const hmacKey = hash;

      console.log("[Debug] Crypto values:", {
        keyLength: key.length,
        ivLength: iv.length,
        hmacKeyLength: hmacKey.length,
      });

      // 데이터 암호화
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      cipher.setAutoPadding(true);

      const encryptedData =
        cipher.update(JSON.stringify(reqData), "utf8", "base64") +
        cipher.final("base64");

      // 무결성 값 생성
      const hmac = crypto.createHmac("sha256", hmacKey);
      hmac.update(encryptedData);
      const integrityValue = hmac.digest("base64");

      const result = {
        ...tokenResponse.data,
        enc_data: encryptedData,
        integrity_value: integrityValue,
      };

      return result;
    } catch (error) {
      console.error("[Debug] Full error:", error);
      throw error;
    }
  }

  // 인증 결과 조회
  async getCertificationResult(token, tokenVersionId, encData, integrityValue) {
    try {
      const requestBody = {
        dataHeader: {
          CNTY_CD: "ko",
        },
        dataBody: {
          token_version_id: tokenVersionId,
          enc_data: encData,
          integrity_value: integrityValue,
        },
      };

      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/digital/niceid/api/v1.0/common/crypto/result`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: requestBody,
      });

      return response.data;
    } catch (error) {
      console.error("getCertificationResult Error:", error);
      throw error;
    }
  }
}

module.exports = NiceAuth;
