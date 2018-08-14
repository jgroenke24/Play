import mongoose from "mongoose";

// Game schema setup
let gameSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    address: String,
    date: Date,
    createdAt: { type: Date, default: Date.now },
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

export default mongoose.model("Game", gameSchema);