const crypto = require("crypto");

module.exports = (secretKey, email) => {
  return crypto
    .createHmac("sha256", secretKey)
    .update(email)
    .digest("hex");
};
