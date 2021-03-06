const express   = require("express");
const passport  = require("passport");
const router    = express.Router({ mergeParams: true });

// Import database models
const User          = require("../models/user");
const Game          = require("../models/game");
const Discussion    = require("../models/discussion")

// Import middleware
const middleware = require("../middleware");

// Root route
router.get("/", (req, res) => {
    // Get all games from db
    Game.find({}, (err, allGames) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/");
        } else {
            res.render("landing", { games: allGames });
        }
    });
});

router.get("/dashboard", middleware.isLoggedIn, (req, res) => {
    // Get all games from db
    Game.find({}, (err, allGames) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.  Please try again.");
            res.redirect("/");
        } else {
            Discussion.find({}, (err, allDisc) => {
                if (err) {
                    req.flash("error", "Something went wrong.  Please try again.");
                    res.redirect("/");
                } else {
                    res.render("dashboard", { games: allGames, discs: allDisc });
                }
            });
        }
    });
});

// =====================
// AUTHENTICATION ROUTES
// =====================

// Show register form
router.get("/register", (req, res) => {
    res.render("register", { page: "register" });
});

// Register new user
router.post("/register", (req, res) => {
    let newUser = new User(
        {
            username: req.body.username,
            email: req.body.email
        }
    );
    User.register(newUser, req.body.password, (err, user) => {
        /*
        CATCH DUPLICATE EMAIL HERE!!!!
        */
        
        if (err) {
            return res.render("register", { user: user, error: err.message });
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Play! " + user.username);
            res.redirect("/dashboard");
        });
    });
});

// Show login form
router.get("/login", (req, res) => {
    res.render("login", { page: "login" });
});

// Log in user
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/dashboard",
        successFlash: "Welcome!",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
});

// Log out
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You logged out.");
    res.redirect("/dashboard");
});

module.exports = router;