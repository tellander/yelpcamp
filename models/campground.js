var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    comments: [{ //creates an array of object ids (referenced data, not embeded)
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment" //name of the model
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;