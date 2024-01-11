import jwt from "jsonwebtoken";
import createError from "http-errors";

async function auth(req, res, next) {
  try {
    const token = req.cookies['x-auth-token'];
    console.log("Token", token);
    if(token) {
      req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    }
    next();
  } catch (err) {
    // If the validation fails, create and throw a custom error
    return res.status(401).redirect("/")
  }
}

export default auth;