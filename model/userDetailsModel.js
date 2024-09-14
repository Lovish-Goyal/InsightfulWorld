import mongoose from "mongoose";

const UserDetailSchema = new mongoose.Schema({
  username: String,
  email: String,
  mobile: String,
  About: String,
  image: String,
});

const UserDetailsModel = mongoose.model("User-Details", UserDetailSchema);

export default UserDetailsModel;
