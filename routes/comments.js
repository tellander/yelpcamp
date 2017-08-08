var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    isLoggedIn = require("../middleware/index").isLoggedIn,
    checkCommentOwnership = require("../middleware/index").checkCommentOwnership,
    flash = require("connect-flash");


//------NESTED ROUTES------
//new comment route
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//create comment route
router.post("/", isLoggedIn, function(req, res) {
    //find the campground
    //populate the comment to the comment array on the campground
    //save the campground
    //redirect to show page
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong creating the comment.");
                } else {
                    console.log(comment);
                    //add the username & id to the comment author
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    //populate campground with comment
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            Comment.findById(req.params.comment_id, function(err, comment) {
                //error being processed in the middlware: checkCommentOwnership
                res.render("comments/edit", {comment: comment, campground: campground});
            });
        }
    });
});

//UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log("added comment: " + comment);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log("deleted comment: " + comment);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;