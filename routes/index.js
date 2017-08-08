var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

//root route
router.get("/", function(req, res) {
    res.render("landing");
});

//REGISTRATION ROUTES
router.get("/register", function(req, res) {
    res.render("auth/register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username}),
        password = req.body.password;
    User.register(newUser, password, function(err, user) {
        if(err) {
            console.log(err);
            req.flash("error", err.name + ": " + err.message);
            return res.redirect("/register");
        }
        console.log(user);
        //now that the user is registered; login
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
})

//LOGIN/LOGOUT ROUTES

router.get("/login", function(req, res) {
    res.render("auth/login");
});

router.post("/login", passport.authenticate('local', {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "You are now logged in!"
}));

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You're now logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;