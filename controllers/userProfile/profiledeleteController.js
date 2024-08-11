import UserModel from "../../model/userModel.js";
const profiledeleteController = async (req, res) => {
  const userId = String(req.params.id);
  const deletedUser = await UserModel.findByIdAndDelete(userId);
  if (deletedUser) {
    console.log("user deleted");
  } else {
    console.log("error in deletion");
  }
  res.redirect("/session");
};

export default profiledeleteController;
