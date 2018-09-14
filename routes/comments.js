const express   = require("express");
const router    = express.Router({ mergeParams: true });

// Import database models
const Game          = require("../models/game");
const Comment       = require("../models/comment");
const Discussion    = require("../models/discussion");

// Import middleware
const middleware    = require("../middleware");

// New route - show form to create new comment
router.get("/games/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    Game.findById(req.params.id, (err, foundGame) => {
        if (err || !foundGame) {
            console.log(err);
            req.flash("error", "Could not find information on that game.  Please try again.");
            res.redirect("/games");
        } else {
            res.render("comments/new", { game : foundGame, route: "games" });
        }
    });
});

router.get("/discussions/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    Discussion.findById(req.params.id, (err, foundDiscussion) => {
        if (err || !foundDiscussion) {
            req.flash("error", "Could not find information on that discussion.  Please try again.");
            res.redirect("/dashboard");
        } else {
            res.render("comments/new", { discussion: foundDiscussion, route: "discussions"});
        }
    });
});

// Create route - add new comment to database
router.post("/games/:id/comments", middleware.isLoggedIn, (req, res) => {
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
                    // Add username and id to comment
                    newlyCreatedComment.author = {
                        id: req.user._id,
                        username: req.user.username
                    };
                    newlyCreatedComment.save();
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

router.post("/discussions/:id/comments/", middleware.isLoggedIn, (req, res) => {
    // Lookup discussion
    Discussion.findById(req.params.id, (err, foundDiscussion) => {
        if (err || !foundDiscussion) {
            req.flash("error", "Could not find information on that discussion.  Please try again.");
            res.redirect("/dashboard");
        } else {
            // Create new comment and save to database
            Comment.create(req.body.comment, (err, newlyCreatedComment) => {
                if (err || !newlyCreatedComment) {
                    req.flash("error", "Could not create comment.  Please try again.");
                    res.redirect("/discussions/" + foundDiscussion._id);
                } else {
                    // Add username and id to comment
                    newlyCreatedComment.author = {
                        id: req.user._id,
                        username: req.user.username
                    };
                    newlyCreatedComment.save();
                    // Connect new comment to game
                    foundDiscussion.comments.push(newlyCreatedComment);
                    foundDiscussion.save();
                    req.flash("success", "Comment created.");
                    // Redirect to game show page
                    res.redirect("/discussions/" + foundDiscussion._id);
                }
            });
        }
    });
});

// Edit route - edit the comment
router.get("/games/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    // First find the game in the database
    Game.findById(req.params.id, (err, foundGame) => {
        if (err || !foundGame) {
            req.flash("error", "Could not find information on that game.  Please try again.");
            return res.redirect("/games/" + req.params.id);
        }
        // Now find the comment in the database
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("error", "Could not find comment.  Please try again.");
                res.redirect("/games/" + foundGame._id);
            } else {
                res.render("comments/edit", { game: foundGame, comment: foundComment, route: "games" });
            }
        });
    });
});

router.get("/discussions/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    // First find the discussion in the database
    Discussion.findById(req.params.id, (err, foundDiscussion) => {
        if (err || !foundDiscussion) {
            req.flash("error", "Could not find information on that discussion.  Please try again.");
            return res.redirect("/discussions/" + req.params.id);
        }
        // Find comment
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("error", "Could not find comment.  Please try again.");
                req.redirect("/discussions/" + foundDiscussion._id);
            } else {
                res.render("comments/edit", { discussion: foundDiscussion, comment: foundComment, route: "discussions" });
            }
        });
    });
});

// Update route - update comment with information from edit form
router.put("/games/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, result) => {
        if (err || !result) {
            console.log(err);
            req.flash("error", "Could not update your comment.  Please try again.");
            res.redirect("/games");
        } else {
            req.flash("success", "Comment updated.");
            res.redirect("/games/" + req.params.id);
        }
    });
});

router.put("/discussions/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, result) => {
        if (err || !result) {
            req.flash("error", "Could not update your comment.  Please try again.");
            res.redirect("/discussions/" + req.params.id);
        } else {
            req.flash("success", "Comment updated.");
            res.redirect("/discussions/" + req.params.id);
        }
    });
});

// Destroy route - delete comment
router.delete("/games/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
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

router.delete("/discussions/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/discussions/" + req.params.id);
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/discussions/" + req.params.id);
        }
    });
});

module.exports = router;