const mongoose = require("mongoose");

// Game schema setup
let gameSchema = new mongoose.Schema({
    title: String,
    address: String,
    lat: Number,
    lng: Number,
    date: Date,
    gameType: String,
    fieldType: String,
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
    ],
    playersGoing: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    ]
});

module.exports = mongoose.model("Game", gameSchema);