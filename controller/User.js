import { validateNewUser, validateUser } from "../utils/validate.js";
import DB from "../db/db.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { fetchUserById } from "../db/functions.js";

export function login(req, res) {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  DB.query(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    (err, result) => {
      if (err) return res.status(400).send("email id not found");
      if (result.length) {
        const user = result[0];
        const hashedPassword = user.password;

        bcrypt.compare(req.body.password, hashedPassword, (err, valid) => {
          if (err) {
            return res.status(401).send("Incorrect Password");
          }

          if (valid) {
            const token = jwt.sign(
              { _id: user.id },
              process.env.JWT_PRIVATE_KEY,
              { expiresIn: "24h" }
            );

            return res
              .cookie("x-auth-token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
              })
              .status(200)
              .send({ _id: user.id });
          }
        });
      }
    }
  );
}

export function register(req, res) {
  const { error } = validateNewUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  DB.query(
    "SELECT email FROM users WHERE email = ?",
    [req.body.email],
    (err, result) => {
      if (err)
        return res.status(400).send("Something went wrong! Try again later");

      if (result.length) {
        return res.status(401).send("User already exist.");
      }
    }
  );

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        gender: req.body.gender,
        dob: JSON.stringify([req.body.day, req.body.month, req.body.year]),
      };

      console.log(newUser);

      DB.query(
        "INSERT INTO users (name, email, password, gender, dob) VALUES (?, ?, ?, ?, ?)",
        [...Object.values(newUser)],
        (err, result) => {
          if (err) return res.status(401).send(err);

          const token = jwt.sign(
            { _id: result.insertId },
            process.env.JWT_PRIVATE_KEY,
            {
              expiresIn: "24hr",
            }
          );

          return res
            .cookie("x-auth-token", token, {
              httpOnly: true,
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })
            .status(200)
            .json({ _id: result.insertId });
        }
      );
    });
  });
}

export async function getUserData(req, res) {
  const { _id } = req.body;
  DB.query("SELECT * FROM users WHERE id = ?", [_id], (err, result) => {
    if (result.length) {
      const { password, ...userData } = result[0];
      return res.send(userData);
    }
  });
}
