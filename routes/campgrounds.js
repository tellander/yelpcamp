var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    isLoggedIn = require("../middleware/index").isLoggedIn,
    checkCampgroundOwnership = require("../middleware/index").checkCampgroundOwnership;


//index route
router.get("/", function(req, res) {
    req.user
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

//new route
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
})

//create route
router.post("/", isLoggedIn, function(req, res) {
    //get data from form and add to array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // campgrounds.push(newCampground);
    //create a new campground and save to db
    Campground.create(newCampground, function(err, addedCampground) {
        if(err) {
            console.log(err); //generally this is where we'd show the user an error
        } else {
            console.log(addedCampground);
            //redirect back to index route (campgrounds)
            req.flash("success", "New campground has been added!");
            res.redirect("/campgrounds");
        }
    });
});

//show route
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            //render the show page, and pass in the found campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit route
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    //why do I need to find the campground again here?
    //the middleware is using next() and res.redirect("back"), so if
    //the condition is true the anonymous route callback is being called; function(req, res)...
    //The Campground.findbyid method needs to be called in the middleware to find the campground,
    //and the route callback is calling the campground again to perform the redirection or
    //other operations specific to that route. The campground has to be found in the middleware
    //for validation, though.
    Campground.findById(req.params.id, function(err, campground) {
        //the error is already being handled by the middleware.
        res.render("campgrounds/edit", {campground: campground});
    });
});

//update route
router.put("/:id", checkCampgroundOwnership, function(req, res) {
    //find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            console.log(err);
            req.flash("error", "Error updating the campground.");
            res.redirect("/campground/" + req.params.id);
        } else {
            req.flash("success", "Campground has been updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    //find and remove the campground
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
            req.flash("error", "Error deleting the campground.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground has been deleted.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;