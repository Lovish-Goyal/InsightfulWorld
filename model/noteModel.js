import mongoose, { Schema } from "mongoose";

const NotesSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
});

const NotesModel = mongoose.model("Note", NotesSchema);

export default NotesModel;
