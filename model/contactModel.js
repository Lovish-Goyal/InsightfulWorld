import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  username: String,
  email: String,
  message: String,
});

const ContactModel = mongoose.model("Contact", ContactSchema);

export default ContactModel;
