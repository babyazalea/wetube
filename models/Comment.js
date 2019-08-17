import mongoose from "mongoose";

const CommetnSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required"
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const model = mongoose.model("Comment", CommetnSchema);
export default model;
