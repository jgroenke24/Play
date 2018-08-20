const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// User schema setup
let userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);