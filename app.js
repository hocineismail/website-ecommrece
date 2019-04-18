const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash"); 
const passport = require("passport");
var routesAdmin = require('./routes/routesAdmin/routesAdmin')

var auth = require('./routes/auth/auth')
mongoose.connect("mongodb://localhost:27017/projet-Univ");

// routes

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(
  session({
    secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
    resave: true,
    saveUninitialized: true,

          

  })
)
app.use(flash());
app.use(routesAdmin)
app.use(auth)

var setUpPassport = require('./routes/setuppassport')


setUpPassport()

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//using folder views
app.use(express.static(__dirname + '/public'))
app.engine('ejs', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
)

app.get("/404", (req,res) => {
  res.render("404")
})

app.get('*', function(req, res){
  res.redirect("/404")
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
  next();
  } else {
 
  res.redirect("/");
  }
 }
app.listen(3000, () => {
  console.log('Server listing on 3000')
})