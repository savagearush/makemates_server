import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import User from "./routes/User.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials : true
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user", User);

app.get("/", (req, res) => {
  res.send("Server is up and running...");
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
