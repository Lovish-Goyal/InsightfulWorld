import mongoose, { Schema } from "mongoose";

const thoughtSchema = new mongoose.Schema({
  content: String,
  userId: mongoose.Schema.Types.ObjectId,
});

const ThoughtModel = mongoose.model("Thought", thoughtSchema);

export default ThoughtModel;
