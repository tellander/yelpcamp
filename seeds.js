var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment.js");

var data = [
    {name: "Salmon Cheeks Hills", image: "https://farm4.staticflickr.com/3895/15030126225_9ef5b51e4a.jpg", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},
    {name: "Campers' Cove", image: "https://farm5.staticflickr.com/4217/34703520630_7383f9e07a.jpg", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},
    {
        name: "Deer Woods",
        image: "https://farm7.staticflickr.com/6186/6090714876_44d269ed7e.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
    //{name: "Salmon Cheeks Hills", image: "https://farm4.staticflickr.com/3895/15030126225_9ef5b51e4a.jpg", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
];

function seedDB() {
    //remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Cleared campground data");
            //add a few campgrounds
            data.forEach(function(seed) {
                Campground.create(seed, function(err, campground) {
                    if(err) {
                        //this is where I'd normally display some error ui element to the user
                        console.log(err);
                    } else {
                        console.log("Added a campground.");
                        //add a comment here...
                        Comment.create({
                            text: "This place is great, but I wish there was internet",
                            author: "Joshua" //will eventually be a reference to a user model when implementing authentication
                        }, function(err, comment) { //this number of callbacks is called "callback hell"
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment");
                            }
                        });
                    }
                });
            });
        }
    });



}

module.exports = seedDB;