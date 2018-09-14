const express = require("express");
const router  = express.Router({ mergeParams: true });

// Import database models
const Discussion    = require("../models/discussion");
const User          = require("../models/user");
const Comment       = require("../models/comment");

// Import middleware
const middleware    = require("../middleware");

// New route - show form to create new discussion
router.get("/discussions/new", middleware.isLoggedIn, (req, res) => {
    res.render("discussions/new");
});

// Create route - add new discussion to database
router.post("/discussions", middleware.isLoggedIn, (req, res) => {
    let newDisc = req.body.disc;
    // Validate user inputs
    if (!newDisc.title || !newDisc.text) {
        req.flash("error", "One or more of your submissions was invalid.  Please try again");
        return res.redirect("/discussions/new");
    }
    newDisc.creator = {
        id: req.user._id,
        username: req.user.username
    };
    // Create new discussion and save to database
    Discussion.create(newDisc, (err, newlyCreatedDiscussion) => {
        if (err || !newlyCreatedDiscussion) {
            req.flash("error", "Could not create your discussion.  Please try again.");
            res.redirect("/discussions/new");
        } else {
            req.flash("success", "Discussion created.");
            res.redirect("/dashboard");
        }
    });
});

// Show route - show more info about a discussion
router.get("/discussions/:id", middleware.isLoggedIn, (req, res) => {
    Discussion.findById(req.params.id).populate("comments").populate("users").exec((err, foundDiscussion) => {
        if (err || !foundDiscussion) {
            req.flash("error", "Could not find information on that discussion.  Please try again.");
            res.redirect("/dashboard");
        } else {
            res.render("discussions/show", { discussion: foundDiscussion, page: "discussion-show" });
        }
    });
});

// Edit route - edit the discussion info
router.get("/discussions/:id/edit", middleware.checkDiscussionOwnership, (req, res) => {
    Discussion.findById(req.params.id, (err, foundDiscussion) => {
        if (err || !foundDiscussion) {
            req.flash("error", "Could not find information on that discussion.  Please try again.");
            res.redirect("/dashboard");
        } else {
            res.render("discussions/edit", { discussion: foundDiscussion });
        }
    });
});

// Update route - update discussion info from edit form
router.put("/discussions/:id", middleware.checkDiscussionOwnership, (req, res) => {
    // Validate user input
    let editDisc = req.body.disc;
    if (!editDisc.title || !editDisc.text) {
        req.flash("error", "One or more inputs were invalid.  Please try again.");
        return res.redirect("/discussions/" + req.params.id);
    }
    // Update discussion
    Discussion.findByIdAndUpdate(req.params.id, editDisc, (err, result) => {
        if (err) {
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/discussions/" + req.params.id);
        } else {
            req.flash("succes", "Discussion updated.");
            res.redirect("/discussions/" + req.params.id);
        }
    });
});

// Destroy route - delete discussion
router.delete("/discussions/:id", middleware.checkDiscussionOwnership, (req, res) => {
    Discussion.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/dashboard");
        } else {
            req.flash("success", "Discussion deleted.");
            res.redirect("/dashboard");
        }
    });
});

module.exports = router;