const jwt = require("jsonwebtoken");

const validateJwt = (token) => {
  const publicKey = process.env.JWT_PUBLIC_KEY;

  try {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { validateJwt };
