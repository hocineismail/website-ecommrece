var express = require("express");
var auth = express.Router();
var express = require("express");

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
    
    

module.exports = auth;