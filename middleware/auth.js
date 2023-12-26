import {expressjwt as jwt} from "express-jwt";
import createError from "http-errors";

async function auth(req, res, next) {
  try {
    // Validate the JWT and set req.user
    await jwt({
      secret: process.env.JWT_PRIVATE_KEY,
      algorithms: ["HS256"],
      getToken: (req) => req.cookies["x-auth-token"],
      // Set the expiration time in seconds
      // You can also use a string like "1h" for one hour
      expiresIn: 24 * 60 * 60,
    })(req, res, next);
    // If the validation succeeds, call the next middleware
    next();
  } catch (err) {
    // If the validation fails, create and throw a custom error
    throw createError(401, "session expired!! Login again");
  }
}

export default auth;