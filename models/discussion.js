const mongoose = require("mongoose");

// Discussion schema setup
let discussionSchema = new mongoose.Schema({
    title: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
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

module.exports = mongoose.model("Discussion", discussionSchema);