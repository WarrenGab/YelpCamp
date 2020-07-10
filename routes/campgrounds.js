const	express		= require("express"),
		router		= express.Router(),
	  	Campground	= require("../models/campground"),
	  	Comment 	= require("../models/comment"),
	  	middleware	= require("../middleware");

//INDEX
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
		}
	})
});
//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	//Get the data and Post it to database
	var newName = req.body.name;
	var price = req.body.price;
	var newImage = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: newName, price: price, image: newImage, description: desc, author: author}
	//Create a New Campground
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect
			res.redirect("/campgrounds");
		}
	});
});
//SHOW
router.get("/:id", function(req, res){
	//Find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//Render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	})
});
//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find then update the campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
	// redirect to show page
});
//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
		if(err){
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany({_id: {$in: campgroundRemoved.comments} }, function(err){
				if(err){
					console.log(err);
				}
				res.redirect("/campgrounds");
			})
		}
	})
});

module.exports = router;