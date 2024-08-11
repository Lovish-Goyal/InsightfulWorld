import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mainrouter from "./routes/router.js";

const app = express();

app.use(
  session({
    secret: "express-to-do",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", mainrouter);

app.listen(8080, async function () {
  try {
    await mongoose
      .connect("mongodb://127.0.0.1:27017/react-learning")
      .then((respose) => {
        console.log("App is working on 8080");
      });
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
