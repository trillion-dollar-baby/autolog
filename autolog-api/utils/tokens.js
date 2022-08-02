/**
 * tokens.js is in charge of creating and validating user tokens
 */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const TOKEN_EXPIRATION_TIME = "12h";

/**
 * load token with payload before returning to user
 */
const createUserJwt = (user) => {
  // information that will be stored in token
  const payload = {
    id: user.id,
    email: user.email,
  };
  return generateToken(payload);
};

/**
 *  generate token using jsonwebtoken library
 */

const generateToken = (data) =>
  jwt.sign(data, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION_TIME });

/**
 * verify token is valid so we can use its payload
 */

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return {};
  }
};

const verifyConfirmationToken = (token, secret) => {
  return jwt.verify(token, secret)
}

module.exports = {
  generateToken,
  validateToken,
  createUserJwt,
  verifyConfirmationToken,
};
