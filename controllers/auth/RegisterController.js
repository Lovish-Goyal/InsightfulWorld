import UserDetailsModel from "../../model/userDetailsModel.js";
import UserModel from "../../model/userModel.js";

const RegisterController = async (req, res) => {
  try {
    const newUser = await UserModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const userDetails = await UserDetailsModel.create({
      userId: newUser._id,
      email: newUser.email,
    });

    console.log("User created:", newUser);
    console.log("User details created:", userDetails);

    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

export default RegisterController;
