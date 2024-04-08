const crypto = require("crypto");

module.exports = (secretKey, str) => {
  return crypto.createHmac("sha256", secretKey).update(str).digest("hex");
};
