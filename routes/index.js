const	express	= require("express"),
		router	= express.Router(),
	  	passport= require("passport"),
	  	User	= require("../models/user");

// Root Route
router.get("/", function(req, res){
	res.render("landing");
});

// ==================
// AUTH ROUTES
// ==================

// show register form
router.get("/register", function(req, res){
	res.render("register");
});
// handling signup logic
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message)
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		})
	})
});

// show login form
router.get("/login", function(req, res){
	res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){	
});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds");
});

module.exports = router;