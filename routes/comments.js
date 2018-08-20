const express   = require("express");
const router    = express.Router({ mergeParams: true });

// Import database models
const User      = require("../models/user");
const Game      = require("../models/game");
const Comment   = require("../models/comment");

// New route - show form to create new comment
router.get("/games/:id/comments/new", (req, res) => {
    Game.findById(req.params.id, (err, foundGame) => {
        if (err || !foundGame) {
            console.log(err);
            req.flash("error", "Could not find information on that game.  Please try again.");
            res.redirect("/games");
        } else {
            res.render("comments/new", { game : foundGame });
        }
    });
});

// Create route - add new comment to database
router.post("/games/:id/comments", (req, res) => {
    // Lookup game using id
    Game.findById(req.params.id, (err, foundGame) => {
        if (err) {
            console.log(err);
            req.flash("error", "Could not find information on that game.  Please try again.");
            res.redirect("/games");
        } else {
            // Create new comment and save to database
            Comment.create(req.body.comment, (err, newlyCreatedComment) => {
                if (err) {
                    console.log(err);
                    req.flash("error", "Could not create comment.  Please try again.");
                    res.redirect("/games/" + foundGame._id);
                } else {
                    // Connect new comment to game
                    foundGame.comments.push(newlyCreatedComment);
                    foundGame.save();
                    req.flash("success", "Comment created.");
                    // Redirect to game show page
                    res.redirect("/games/" + foundGame._id);
                }
            });
        }
    });
});

// Edit route - edit the comment
router.get("/games/:id/comments/:comment_id/edit", (req, res) => {
    // First find the game in the database
    Game.findById(req.params.id, (err, foundGame) => {
        if (err || !foundGame) {
            /*
            HANDLE THIS ERROR BETTER!!!!! PREFERABLY WITH A FLASH!!!
            */
            console.log(err);
            return res.redirect("/games/" + req.params.id);
        }
        // Now find the comment in the database
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                /*
                HANDLE THIS ERROR BETTER!!!!! PREFERABLY WITH A FLASH!!!
                */
                console.log(err);
                res.redirect("/games/" + foundGame._id);
            } else {
                res.render("comments/edit", { game: foundGame, comment: foundComment});
            }
        });
    });
});

// Update route - update comment with information from edit form
router.put("/games/:id/comments/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", "Could not update your comment.  Please try again.");
            res.redirect("/games");
        } else {
            req.flash("success", "Comment updated.");
            res.redirect("/games/" + req.params.id);
        }
    });
});

// Destroy route - delete comment
router.delete("/games/:id/comments/:comment_id", (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/games");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/games/" + req.params.id);
        }
    });
});

module.exports = router;