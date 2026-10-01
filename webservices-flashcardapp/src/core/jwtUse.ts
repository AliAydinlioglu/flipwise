import config from "config";
import jwt, { type SignOptions } from "jsonwebtoken";

const JWTSECRET: string = config.get("auth.jwt.secret");

/**
 *
 * @param user_id
 * @param expiresInSeconds
 * @returns
 */
const generateJWT = (user_id: number, expiresInSeconds?: number) => {
  const options: SignOptions = {};

  if (expiresInSeconds !== undefined) {
    options.expiresIn = expiresInSeconds;
  } else {
    options.expiresIn = 3600;
  }

  const payload = {
    user_id: user_id,
  };

  const jwtToken = jwt.sign(payload, JWTSECRET, options);

  return jwtToken;
};

/**
 *
 * @param jwtToken
 * @returns
 */
const decodeVerifyJWT = (jwtToken: string) => {
  try {
    const checked = jwt.verify(jwtToken, JWTSECRET);

    return checked;
  } catch (err) {
    return false;
  }
};

// Every database update across the platform is associated with a specific user account. This necessitates a user ID, which we obtain from a JWT through the getUserID function. Essentially, to make any modification in the database, we invariably need a user ID derived from a JWT.
/**
 *
 * @param jwtToken
 * @returns
 */
const getUserID = (jwtToken: string) => {
  const decoded = decodeVerifyJWT(jwtToken);

  if (typeof decoded === "string" || decoded === false) {
    return false;
  } else {
    return decoded.user_id;
  }
};

export default {
  generateJWT,
  decodeVerifyJWT,
  getUserID,
};
