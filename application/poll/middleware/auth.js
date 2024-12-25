const { validateJwt } = require("../service/jwt");

const verifyAndValidateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Missing auth token!" });

  const jwt = token.split(" ")[1];
  if (!jwt) return res.status(401).json({ message: "Missing auth token!" });

  const content = validateJwt(jwt);
  if (!content) return res.status(401).json({ message: "Invalid auth token!" });

  req.jwtContent = content;
  next();
};

module.exports = { verifyAndValidateToken };
