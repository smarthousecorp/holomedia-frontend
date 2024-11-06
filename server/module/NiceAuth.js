const crypto = require("crypto");
const axios = require("axios");
const qs = require("querystring");
const niceConfig = require("../config/niceConfig");

class NiceAuth {
  constructor() {
    this.clientId = niceConfig.clientId;
    this.clientSecret = niceConfig.clientSecret;
    this.productId = niceConfig.productId;
    this.baseUrl = niceConfig.baseUrl;
  }

  // Access Token 발급
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
      console.log(response.data);
      return response.data.dataBody.access_token;
    } catch (error) {
      console.error("getAccessToken Error:", error);
      throw error;
    }
  }

  // 암호화 데이터 생성
  generateCryptData(reqData) {
    try {
      // 암호화 키 생성 (32byte)
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      // 데이터 암호화
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      cipher.setAutoPadding(true);

      let encrypted = cipher.update(JSON.stringify(reqData), "utf8", "base64");
      encrypted += cipher.final("base64");

      // integrity value 생성
      const hmac = crypto.createHmac("sha256", key);
      hmac.update(encrypted);
      const integrityValue = hmac.digest("base64");

      return {
        key: key.toString("base64"),
        iv: iv.toString("base64"),
        encrypted,
        integrityValue,
      };
    } catch (error) {
      console.error("generateCryptData Error:", error);
      throw error;
    }
  }

  // 암호화 데이터 복호화
  decryptData(encryptedData, key, iv) {
    try {
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(key, "base64"),
        Buffer.from(iv, "base64")
      );

      let decrypted = decipher.update(encryptedData, "base64", "utf8");
      decrypted += decipher.final("utf8");

      return JSON.parse(decrypted);
    } catch (error) {
      console.error("decryptData Error:", error);
      throw error;
    }
  }

  // 본인인증 요청
  async requestCertification(token, reqData) {
    try {
      const cryptData = this.generateCryptData(reqData);

      const requestBody = {
        dataHeader: {
          CNTY_CD: "ko",
        },
        dataBody: {
          req_dtim: new Date().toISOString(),
          req_no: crypto.randomBytes(16).toString("hex"),
          enc_mode: "1",
          productId: this.productId,
          key: cryptData.key,
          iv: cryptData.iv,
          crypto_cert_url: reqData.returnUrl, // 인증 완료 후 리턴될 URL
          integrity_value: cryptData.integrityValue,
          token_version_id: crypto.randomBytes(16).toString("hex"),
          enc_data: cryptData.encrypted,
        },
      };

      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/digital/niceid/api/v1.0/common/crypto/token`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: requestBody,
      });

      return response.data;
    } catch (error) {
      console.error("requestCertification Error:", error);
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
