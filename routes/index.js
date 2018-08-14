import express  from "express";
import passport from "passport";
const router = express.Router({ mergeParams: true });

// Import database models
import User     from "../models/user";
import Game     from "../models/game";
import Comment  from "../models/comment";

// Root route
router.get("/", (req, res) => {
    res.render("landing");
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
            res.redirect("/games");
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
        successRedirect: "/games",
        successFlash: "Welcome!",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
});

// Log out
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You logged out.");
    res.redirect("/games");
});

export default router;