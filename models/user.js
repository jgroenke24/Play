import mongoose                 from "mongoose";
import passportLocalMongoose    from "passport-local-mongoose";

// User schema setup
let userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);