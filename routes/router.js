import express from "express";
import ThoughtModel from "../model/thoughtModel.js";
import authenticationRouter from "./auth/authrouter.js";
import saveThoughtController from "../controllers/Thoughts/saveThoughtController.js";
import deleteThoughtController from "../controllers/Thoughts/deleteThoughtController.js";
import profiledeleteController from "../controllers/userProfile/profiledeleteController.js";
import profileEditController from "../controllers/userProfile/profileEditController.js";
import sessiondeleteController from "../controllers/userProfile/sessiondeleteController.js";
import ContactController from "../controllers/contact/ContactController.js";
import UpdateController from "../controllers/auth/updateController.js";

const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const data = await ThoughtModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          username: "$userDetails.username",
        },
      },
    ]);
    console.log({ data }.userDetails);
    res.render("welcomeScreen.ejs", { data: data });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

router.use("/", authenticationRouter);

router.post("/contact/post", ContactController);

router.put("/users/:userId", UpdateController);

router.get("/userHome", async function (req, res) {
  const targetuser = req.session.targetuser;
  const userId = targetuser._id;
  const data = await ThoughtModel.find({ userId: userId });
  res.render("userHome.ejs", { data: data, username: targetuser.username });
});

router.post("/userHome/saveThought", saveThoughtController);

router.get("/userHome/deleteThought/:id", deleteThoughtController);

router.get("/profile", async (req, res) => {
  const targetuser = req.session.targetuser;
  const userId = targetuser._id;
  const data = await ThoughtModel.find({ userId: userId });

  res.render("profile.ejs", {
    username: targetuser.username,
    email: targetuser.email,
    id: userId,
    data: data,
    mobile: targetuser.mobile || null,
    about:
      targetuser.about ||
      "Hey User, Please Update your About Section yourself.",
    user_image: targetuser.user_image || null,
  });
});

router.get("/profile/delete/:id", profiledeleteController);

router.get("/session", sessiondeleteController);

router.get("/profile_edit", function (req, res) {
  res.render("profile_edit.ejs");
});

router.post("/profile_edit/post", profileEditController);

export default router;
