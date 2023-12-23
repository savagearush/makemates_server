import { validateNewUser } from "../utils/validate.js";
import DB from "../db/db.js";
import bcrypt, { hash } from "bcrypt";
ioprt
export function login(req, res) {}

export function register(req, res) {
  const { error } = validateNewUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  DB.query(
    "SELECT email FROM users WHERE email = ?",
    [req.body.email],
    (err, result) => {
      if (err) res.status(400).send("Something went wrong! Try again later");

      if (result.length) {
        res.status(401).send("User already exist.");
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

      DB.query(
        "INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?, ?, DEFAULT)",
        [...Object.values(newUser)],
        (err, result) => {
          if (err) return res.status(401).send("Something went wrong !");
          return res.status(200).send("success");
        }
      );
    });
  });
}
