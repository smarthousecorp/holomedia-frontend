const crypto = require("crypto");

class NiceCrypto {
  generateKeys(reqDtim, reqNo, tokenVal) {
    // 입력값 trim 처리 후 연결
    const value = `${reqDtim.trim()}${reqNo.trim()}${tokenVal.trim()}`;

    // SHA-256 해시 생성
    const hash = crypto.createHash("sha256").update(value).digest();

    // Base64 인코딩
    const base64Hash = hash.toString("base64");

    // key: 앞에서부터 16byte
    const key = Buffer.from(base64Hash.substring(0, 22), "base64"); // Base64로 16바이트는 22자

    // iv: 뒤에서부터 16byte
    const iv = Buffer.from(base64Hash.slice(-22), "base64");

    // hmac_key: 앞에서부터 32byte
    const hmacKey = Buffer.from(base64Hash.substring(0, 43), "base64"); // Base64로 32바이트는 43자

    return {
      key,
      iv,
      hmacKey,
    };
  }

  encryptData(data, key, iv) {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    cipher.setAutoPadding(true);

    let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
    encrypted += cipher.final("base64");

    return encrypted;
  }

  generateIntegrityValue(encryptedData, hmacKey) {
    const hmac = crypto.createHmac("sha256", hmacKey);
    hmac.update(encryptedData);
    return hmac.digest("base64");
  }
}

module.exports = NiceCrypto;
