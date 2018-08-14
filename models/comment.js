import mongoose from "mongoose";

// Comment schema setup
let commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", commentSchema);