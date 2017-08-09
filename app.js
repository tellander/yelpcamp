var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    session = require("express-session"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

console.log("process.env.DATABASEURL: " + process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost/yelpcamp_v12";
// mongoose.connect("mongodb://localhost/yelpcamp_v12", {useMongoClient: true});
mongoose.connect(url, {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

//AUTH CONFIG
app.use(session({
    secret: "wang chung tonight chickety china",
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//A middleware that runs for every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user; //req.user is available via passport
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp is running...");
});