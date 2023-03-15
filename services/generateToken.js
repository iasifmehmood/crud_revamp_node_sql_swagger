const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

exports.generateToken = payload => {
  const secret = process.env.secretKey;
  const algorithm = "aes-256-cbc";

  const encrypt = (payload, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(payload)),
      cipher.final(),
    ]);
    return {
      iv: iv.toString("base64"),
      data: encrypted.toString("base64"),
    };
  };

  const encryptionKey = crypto.randomBytes(32);
  const encryptedPayload = encrypt(payload, encryptionKey);

  const token = jwt.sign(
    {
      encrypted_payload: encryptedPayload,
    },
    secret,
    { algorithm: "HS256" }
  );

  return token;
};
