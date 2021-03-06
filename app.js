//Requiring Packages and Models
const	express 		= require("express"),
		app 			= express(),
		bodyParser 		= require("body-parser"),
		mongoose		= require("mongoose"),
	  	flash			= require("connect-flash"),
	  	passport		= require("passport"),
	  	LocalStrategy	= require("passport-local"),
	  	methodOverride	= require("method-override"),
		Campground		= require("./models/campground"),
	  	Comment			= require("./models/comment"),
	  	User 			= require("./models/user"),
	  	seedDB			= require("./seeds");

//Requiring Routes
const	commentRoutes		= require("./routes/comments"),
		campgroundRoutes	= require("./routes/campgrounds"),
		indexRoutes			= require("./routes/index");

// seedDB();
// PACKAGE CONFIG <make sure comes before the passport config, there might be potential errors, pay attention to the orders>

// using environment variable (not necessary)
const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect('url', { 
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB!")
// }).catch(err => {
// 	console.log("ERROR", err.message)
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASPORT CONFIG
app.use(require("express-session")({
	secret: "Nama saya Warren Gabriel Mulyawan",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Exporting req.user parameter as currentUser
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Server
const port = process.env.PORT || 3000; 
app.listen(port, function(){
	console.log("Server has started!");
});