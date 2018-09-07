require('dotenv').config();

const express          = require("express");
const bodyParser       = require("body-parser");
const mongoose         = require("mongoose");
const methodOverride   = require("method-override");
const flash            = require("connect-flash");
const session          = require("express-session");
const passport         = require("passport");
const LocalStrategy    = require("passport-local");

// Import database models
const User             = require("./models/user");
const Game             = require("./models/game");
const Comment          = require("./models/comment");

// Import routes
const indexRoutes      = require("./routes/index");
const gameRoutes       = require("./routes/games");
const commentRoutes    = require("./routes/comments");

// Import database seed
const seedDB           = require("./seeds");

const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

// View engine setup
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.locals.moment = require("moment");

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