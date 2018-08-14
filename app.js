require('dotenv').config();

import express          from "express";
import bodyParser       from "body-parser";
import mongoose         from "mongoose";
import methodOverride   from "method-override";
import flash            from "connect-flash";
import session          from "express-session";
import passport         from "passport";
import LocalStrategy    from "passport-local";

// Import database models
import User             from "./models/user";
import Game             from "./models/game";
import Comment          from "./models/comment";

// Import routes
import indexRoutes      from "./routes/index";
import gameRoutes       from "./routes/games";
import commentRoutes    from "./routes/comments";

const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

// View engine setup
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(gameRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP,() => console.log("Play! Server Started"));