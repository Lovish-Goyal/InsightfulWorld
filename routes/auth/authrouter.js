import express from "express";
import LoginController from "../../controllers/auth/LoginController.js";
import RegisterController from "../../controllers/auth/RegisterController.js";

const authrouter = express.Router();

authrouter.get("/register", async function (req, res) {
  res.render("register.ejs");
});

authrouter.get("/login", (req, res) => {
  if (req?.session?.targetuser) {
    res.redirect("/userHome");
    return false;
  }
  res.render("login.ejs", { title: "Login me!" });
});

authrouter.post("/login/post", LoginController);

authrouter.post("/register/post", RegisterController);

export default authrouter;
