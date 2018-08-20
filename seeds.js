const User      = require("./models/user");
const Game      = require("./models/game");
const Comment   = require("./models/comment");

let seeds = [
    {
        title: "Pickup game at PIER 40",
        address: "353 West St, New York, NY 10014",
        date: new Date("8/21/2018 06:30"),
        gameType: "Pickup",
        fieldType: "Turf",
        createdAt: new Date(),
    },
    {
        title: "Meetup at PIER 40",
        address: "353 West St, New York, NY 10014",
        date: new Date("8/27/2018 06:30"),
        gameType: "Pickup",
        fieldType: "Turf",
        createdAt: new Date(),
    },
    {
        title: "Pickup game at LIC",
        address: "4-09 47th Rd, Long Island City, NY 11101",
        date: new Date("8/31/2018 06:30"),
        gameType: "Pickup",
        fieldType: "Turf",
        createdAt: new Date(),
    }
];

async function seedDB() {
    try {
        await Game.remove({});
        console.log("Games removed");
        await Comment.remove({});
        console.log("Comments removed");
        
        for(const seed of seeds) {
            let game = await Game.create(seed);
            console.log("Game created");
            let comment = await Comment.create(
                {
                    text: "I'll be there!",
                    author: "chamo"
                }
            );
            console.log("Comment created");
            game.comments.push(comment);
            game.save();
            console.log("Comment added to game");
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = seedDB;