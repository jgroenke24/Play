const express   = require("express");
const router    = express.Router({ mergeParams: true });

// Import database models
const User      = require("../models/user");
const Game      = require("../models/game");
const Comment   = require("../models/comment");

// Index route - show all games
router.get("/games", (req, res) => {
    // Get all games from db
    Game.find({}, (err, allGames) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/");
        } else {
            res.render("games/index", { games: allGames, page: "games"});
        }
    });
});

// New route - show form to create new game
router.get("/games/new", (req, res) => {
    res.render("games/new");
});

// Create route - add new game to database
router.post("/games", (req, res) => {
    // Validate user inputs
    let newGame = req.body.game;
    if (!newGame.title || !newGame.address || !newGame.date || !newGame.gameType || !newGame.fieldType || !newGame.date || !newGame.time) {
        req.flash("error", "One or more of your submissions was invalid.  Please try again");
        res.redirect("/games/new");
    }
    // Create new game and save to database
    newGame.date = new Date(`${newGame.date} ${newGame.time}`);
    Game.create(newGame, (err, newlyCreatedGame) => {
        if (err) {
            console.log(err);
            req.flash("error", "Could not create your game.  Please try again.");
            res.redirect("/games/new");
        } else {
            req.flash("success", "Game created.");
            res.redirect("/games");
        }
    });
});

// Show route - show more info about a game
router.get("/games/:id", (req, res) => {
    Game.findById(req.params.id).populate("comments").exec((err, foundGame) => {
        if (err || !foundGame) {
            console.log(err);
            req.flash("error", "Could not find information on that game.  Please try again.");
            res.redirect("/games");
        } else {
            res.render("games/show", { game: foundGame });
        }
    });
});

// Edit route - edit the game info
router.get("/games/:id/edit", (req, res) => {
    Game.findById(req.params.id, (err, foundGame) => {
        if (err || !foundGame) {
            console.log(err);
            req.flash("error", "Could not find information on that game.  Please try again.");
            res.redirect("/games");
        } else {
            res.render("games/edit", { game: foundGame });
        }
    });
});

// Update route - update game info with information from edit form
router.put("/games/:id", (req, res) => {
    // Validate user inputs
    let editGame = req.body.game;
    if (!editGame.title || !editGame.address || !editGame.date || !editGame.gameType || !editGame.fieldType || !editGame.date || !editGame.time) {
        req.flash("error", "One or more of your submissions was invalid.  Please try again");
        res.redirect("/games/" + req.params.id);
    }
    Game.findByIdAndUpdate(req.params.id, editGame, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/games/" + req.params.id);
        } else {
            req.flash("success", "Game information updated.");
            res.redirect("/games/" + req.params.id);
        }
    });
});

// Destroy route - delete game
router.delete("/games/:id", (req, res) => {
    Game.findByIdAndRemove(req.params.id, (err) => {
       if (err) {
           console.log(err);
           req.flash("error", "Something went wrong.  Please try again.");
           res.redirect("/games");
       } else {
           req.flash("success", "Game deleted.");
           res.redirect("/games");
       }
    });
});

module.exports = router;