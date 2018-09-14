const Game          = require("../models/game");
const Comment       = require("../models/comment");
const Discussion    = require("../models/discussion");

// All the middleware goes here
let middlewareObj = {};

middlewareObj.checkGameOwnership = function(req, res, next){
    // Is user logged in at all
    if(req.isAuthenticated()){
        Game.findById(req.params.id, function(err, foundGame){
            if(err || !foundGame){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // Does user own campground?
                if (foundGame.creator.id.equals(req.user._id) || req.user.idAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // Is user logged in at all
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // Does user own comment?
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkDiscussionOwnership = function(req, res, next){
    // Is user logged in at all
    if(req.isAuthenticated()){
        Discussion.findById(req.params.id, function(err, foundDiscussion){
            if(err || !foundDiscussion){
                req.flash("error", "Discussion not found");
                res.redirect("back");
            } else {
                // Does user own comment?
                if (foundDiscussion.creator.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;