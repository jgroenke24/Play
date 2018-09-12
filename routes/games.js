const express   = require("express");
const router    = express.Router({ mergeParams: true });

// Import database models
const Game      = require("../models/game");
const User      = require("../models/user");

// Import geocoder for Google Maps
const NodeGeocoder = require('node-geocoder');

// Import middleware
const middleware    = require("../middleware");
 
let options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
let geocoder = NodeGeocoder(options);

// Index route - show all games
router.get("/games", middleware.isLoggedIn, (req, res) => {
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
router.get("/games/new", middleware.isLoggedIn, (req, res) => {
    res.render("games/new", { page: "game-form" });
});

// Create route - add new game to database
router.post("/games", middleware.isLoggedIn, (req, res) => {
    // Validate user inputs
    let newGame = req.body.game;
    if (!newGame.title || !newGame.address || !newGame.date || !newGame.gameType || !newGame.fieldType || !newGame.date || !newGame.time) {
        req.flash("error", "One or more of your submissions was invalid.  Please try again");
        return res.redirect("/games/new");
    }
    newGame.date = new Date(`${newGame.date} ${newGame.time}`);
    newGame.creator = {
        id: req.user._id,
        username: req.user.username
    };
    // Use geocoder to get latitude and longitude for map
    geocoder.geocode(newGame.address, (err, data) => {
        if (err || !data.length) {
            req.flash("error", "Invalid address. Try again.");
            return res.redirect("back");
        }
        newGame.lat = data[0].latitude;
        newGame.lng = data[0].longitude;
        // Create new game and save to database
        Game.create(newGame, (err, newlyCreatedGame) => {
            if (err) {
                console.log(err);
                req.flash("error", "Could not create your game.  Please try again.");
                res.redirect("/games/new");
            } else {
                newlyCreatedGame.playersGoing.push(req.user);
                newlyCreatedGame.save();
                req.flash("success", "Game created.");
                res.redirect("/games");
            }
        });
    });
});

// Show route - show more info about a game
router.get("/games/:id", middleware.isLoggedIn, (req, res) => {
    Game.findById(req.params.id).populate("comments").populate("users").exec((err, foundGame) => {
        if (err || !foundGame) {
            console.log(err);
            req.flash("error", "Could not find information on that game.  Please try again.");
            res.redirect("/games");
        } else {
            res.render("games/show", { game: foundGame, page: "game-show" });
        }
    });
});

// Edit route - edit the game info
router.get("/games/:id/edit", middleware.checkGameOwnership, (req, res) => {
    Game.findById(req.params.id, (err, foundGame) => {
        if (err || !foundGame) {
            console.log(err);
            req.flash("error", "Could not find information on that game.  Please try again.");
            res.redirect("/games");
        } else {
            res.render("games/edit", { game: foundGame, page: "game-form" });
        }
    });
});

// Update route - update game info with information from edit form
router.put("/games/:id", middleware.checkGameOwnership, (req, res) => {
    // Validate user inputs
    let editGame = req.body.game;
    if (!editGame.title || !editGame.address || !editGame.date || !editGame.gameType || !editGame.fieldType || !editGame.date || !editGame.time) {
        req.flash("error", "One or more of your submissions was invalid.  Please try again");
        return res.redirect("/games/" + req.params.id);
    }
    editGame.date = new Date(`${editGame.date} ${editGame.time}`);
    geocoder.geocode(editGame.address, (err, data) => {
        if (err || !data.length) {
            req.flash("error", "Invalid address. Try again.");
            return res.redirect("back");
        }
        editGame.lat = data[0].latitude;
        editGame.lng = data[0].longitude;
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
});

// Destroy route - delete game
router.delete("/games/:id", middleware.checkGameOwnership, (req, res) => {
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

router.get("/games/:id/get-players", (req, res) => {
    console.log("player route!");
    Game.findById(req.params.id, "playersGoing -_id", (err, players) => {
        if (err || !players) {
            console.log(err);
            req.flash("error", "Something went wrong. Please try again.");
        } else {
            res.send(players.playersGoing);
        }
    });
});

router.post("/games/:id/add-player", (req, res) => {
    console.log("add route");
    User.findById(req.body.user, (err, foundUser) => {
        if (err || !foundUser) {
            console.log(err);
        } else {
            Game.findById(req.params.id, (err, foundGame) => {
                if (err || !foundGame) {
                    console.log(err);
                } else {
                    foundGame.playersGoing.push(foundUser);
                    foundGame.save();
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.post("/games/:id/remove-player", (req, res) => {
    console.log("remove route!");
    User.findById(req.body.user, (err, foundUser) => {
        if (err || !foundUser) {
            console.log(err);
        } else {
            Game.findById(req.params.id, (err, foundGame) => {
                if (err || !foundGame) {
                    console.log(err);
                } else {
                    foundGame.playersGoing = foundGame.playersGoing.filter(player => player.username !== foundUser.username);
                    foundGame.save();
                    res.sendStatus(200);
                }
            });
        }
    });
});

module.exports = router;