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
    console.log(req.body.disc);
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

module.exports = router;