/**
 * Security functions to extract and set user payload in
 * res.locals and checks for unauthorized requests
 */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../utils/errors");

/**
 *  function that extracts the JWT from the request header (splits prefix and actual token)
 */

const jwtFrom = ({ headers }) => {
  if (headers?.authorization) {
    const [scheme, token] = headers.authorization.split(" ");
    if (scheme.trim() === "Bearer") {
      return token;
    }
  }

  return undefined;
};

/**
 * Function in the express pipeline in charge to get token from request and verify it is valid
 * to later use the information in the rest of the pipeline
 */

const extractUserFromJwt = (req, res, next) => {
  try {
    const token = jwtFrom(req);
    if (token) {
        try {
            res.locals.user = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return next();
        }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 *  requireAuthenticatedUser verifies a authed user exists for requests that
 *  are only permitted to users with a valid session.
 *  Checks token stored in the res.locals after being extracted
 */

const requireAuthenticatedUser = (req, res, next) => {
  try {
    const { user } = res.locals;
    if (!user?.email) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  requireAuthenticatedUser,
  extractUserFromJwt,
};
