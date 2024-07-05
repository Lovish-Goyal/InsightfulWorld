import express, { response } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import UserModel from "./model/userModel.js";
import NotesModel from "./model/noteModel.js";
import ThoughtModel from "./model/thoughtModel.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

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

app.use(express.static(path.join(__dirname, "public"))); // to add any external styleeshet

app.get("/", async function (req, res) {
  try {
    const data = await ThoughtModel.aggregate([
      {
        $lookup: {
          from: "users", // Join with the users collection
          localField: "userId", // Field in thoughts collection
          foreignField: "_id", // Field in users collection
          as: "userDetails", // Output array field
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true, // Keep documents without a matching user
        },
      },
      {
        $project: {
          _id: 1, // Include the thought's _id
          content: 1, // Include the thought's content
          username: "$userDetails.username", // Include the user's username or null
        },
      },
    ]);
    console.log({ data }.userDetails);
    res.render("home.ejs", { data: data });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

app.get("/register", async function (req, res) {
  res.render("register.ejs");
});

// app.post("/register/post", (req, res) => {
//   const users = userList;
//   users.push(req.body);
//   console.log(users);
//   res.redirect("/login");
// });

app.post("/register/post", async (req, res) => {
  try {
    const data = await UserModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    console.log("success:", data);
    res.redirect("/login");
  } catch (error) {
    console.log("error", error);
  }
});

app.get("/login", (req, res) => {
  if (req?.session?.targetuser) {
    res.redirect("/userHome");
    return false;
  }
  res.render("login.ejs", { title: "Login me!" });
});

app.post("/login/post", async (req, res) => {
  try {
    const targetUser = await UserModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (targetUser) {
      console.log(targetUser);
      req.session.targetuser = targetUser;
      res.redirect("/userHome");
    } else {
      res.send("Email and password do not match.");
    }
  } catch (error) {
    console.log(error);
  }

  // This is user entered
  // const user = req.body;
  // const users = userList;
  // const targetuser = users.find(
  //   (targetuser) =>
  //     targetuser.email === user.email && targetuser.password === user.password
  // );
  // req.session.targetuser = targetuser;
  // res.render("profile.ejs", {
  //   name: targetuser.name,
  //   email: targetuser.email,
  // });
});

app.get("/userHome", async function (req, res) {
  const targetuser = req.session.targetuser;
  const userId = targetuser._id;
  const data = await ThoughtModel.find({ userId: userId });
  res.render("userHome.ejs", { data: data, username: targetuser.username });
});

app.get("/profile", function (req, res) {
  const targetuser = req?.session?.targetuser;
  res.render("profile.ejs", {
    username: targetuser.username,
    email: targetuser.email,
    id: targetuser._id,
  });
});

app.get("/profile/delete/:id", async function (req, res) {
  const userId = String(req.params.id);
  const deletedUser = await UserModel.findByIdAndDelete(userId);
  if (deletedUser) {
    console.log("user deleted");
  } else {
    console.log("error in deletion");
  }
  res.redirect("/session");
});

app.get("/session", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      console.log("Session destroyed successfully");
    }
  });
  res.redirect("/");
});

app.get("/profile_edit", function (req, res) {
  res.render("profile_edit.ejs");
});

app.post("/profile_edit/post", async function (req, res) {
  // if (!req.session || !req.session.targetuser) {
  //   console.log("Session or user not found.");
  //   return res.status(404).send("Session or user not found");
  // }

  const targetuser = req.session.targetuser;
  const userId = targetuser._id;
  // console.log(userId);
  // console.log(req.body.username);
  // console.log(req.body.password);
  // console.log(req.body.email);
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    );
    if (!updatedUser) {
      console.log("User not found.");
      return;
    }

    console.log("User updated successfully");

    req.session.targetuser = updatedUser;

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});

app.post("/userHome/saveThought", function (req, res) {
  const targetuser = req.session.targetuser;
  const userId = targetuser._id;
  ThoughtModel.create({
    content: req.body.content,
    userId: userId,
  })
    .then((response) => {
      console.log(response);
      console.log("Your Thought saved Successfully");
      res.redirect("/userHome");
    })
    .catch((err) => {
      console.log("error in saving your thought");
    });
});

app.get("/userHome/deleteThought/:id", async function (req, res) {
  const ThoughtId = String(req.params.id);
  const ThoughtDeleted = await ThoughtModel.findByIdAndDelete(ThoughtId);
  if (ThoughtDeleted) {
    console.log("Thought deleted");
  } else {
    console.log("error in deletion");
  }
  res.redirect("/userHome");
});

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
