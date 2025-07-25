const httpRes = require("./http");
require("dotenv").config();
const CYS = process.env.CYS;
const cryptoJS = require("crypto-js");

const prepareResponse = (status_code, msg, data, error) => {
  console.log(error);
  return {
    status_code: status_code,
    msg: msg,
    data: cryptoJS.AES.encrypt(JSON.stringify(data), CYS).toString(),
    error: error,
  };
};

const prepareBody = (req, res, next) => {
  if (req.get("Referrer") !== "http://localhost:8080/api-docs/") {
    try {
      const encrypted = req.body.cypher;

      if (!encrypted) throw new Error("No 'cypher' found in request");

      const bytes = cryptoJS.AES.decrypt(encrypted, CYS);
      const decryptedText = bytes.toString(cryptoJS.enc.Utf8);

      console.log("🔐 Encrypted:", encrypted);
      console.log("🔓 Decrypted:", decryptedText);

      if (!decryptedText || decryptedText.trim() === "") {
        throw new Error("Empty or invalid decrypted string");
      }

      req.body = JSON.parse(decryptedText);
    } catch (err) {
      console.error("❌ prepareBody error:", err);
      return res.status(400).json({
        status: 400,
        msg: "Invalid encrypted request body",
        error: err.message,
      });
    }
  }

  next();
};

module.exports = {
  prepareResponse,
  prepareBody,
};
