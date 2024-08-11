import UserModel from "../../model/userModel.js";
const RegisterController = async (req, res) => {
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
};

export default RegisterController;
