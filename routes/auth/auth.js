var express = require("express");
var auth = express.Router();
var express = require("express");
var passport = require("passport");
var User = require("../../models/user");
var session = require('express-session');
auth.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
auth.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
   })
   
auth.get('/login', (req,res )=> {
res.render("login")
})


auth.get('/register', (req,res )=> {
    res.render("signup")
    })
    
    
//his req for signup
auth.post("/signup", function(req, res) {
	
	var email = req.body.username;
	


	User.findOne({ email: email }, function(err, user) {
	if (err) { return next(err); }
	if (user) {
	req.flash("error", "ce User existe");
	return res.redirect("/signup");
	}
	
	var newUser = new User({
	Firstname: req.body.Firstname,
	email: email,
	Lastname: req.body.Lastname,
	Birthday: req.body.Birthday,
	Sexe: req.body.Sexe,
	user: req.body.user,
	Address: req.body.Address,
	Phone: req.body.Phone,
	password: req.body.password,  
});console.log(newUser)
	newUser.save({},function(err, success){
		if (err) { console.log( " ERROR ")}
		if (success) {
			if ( newUser.Role === "Client"){
				var newClient = new Client({
					client: "Client",
					
		
				});
				newClient.save({},(err, saved)=>{
                    newUser.client = newClient._id
                });newUser.save()

			} 
			res.redirect("/routes")
		 }
	
			});
			});	

 },passport.authenticate("login", {
	 
	successRedirect: "/routes",
	failureRedirect: "/signup",
	failureFlash: true
 }));




auth.get("/logout", function(req, res) {

	req.logout();
	res.redirect("/");
 });
module.exports = auth;