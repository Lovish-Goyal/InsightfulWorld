import UserModel from "../../model/userModel.js";
const LoginController = async (req, res) => {
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
};

export default LoginController;
