const jwt = require("jsonwebtoken");

const config = process.env;

const auth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.token;

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ success: false, message: "Invalid token" });
  }
  return next();
};

module.exports = auth;
