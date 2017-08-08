var mongoose = require("mongoose"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment")
    flash = require("connect-flash");
//middleware functions go here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if(err) {
                console.log(err);
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                //does the user own the campground?
                if(campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You're not the owner of this campground.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //validate authentication
    if(req.isAuthenticated()){
        //find the comment
        Comment.findById(req.params.comment_id, function(err, comment) {
            if(err) {
                console.log(err);
                req.flash("error", "Error finding the comment.");
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log(req.user.username + " doesn't own this comment");
                    req.flash("error", "You're not the owner of this comment.");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("User not authenticated");
        req.flash("error", "You need to be logged in first.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first.");
    res.redirect("/login");
}


module.exports = middlewareObj;