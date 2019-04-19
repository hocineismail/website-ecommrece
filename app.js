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
const Produit = require("./models/produit");
const ImageProduir = require("./models/imageProduit")
const Categorie = require("./models/categorie")
var auth = require('./routes/auth/auth')
mongoose.connect("mongodb://localhost:27017/projet-Univc");

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
    successRedirect: '/routes',
    failureRedirect: '/login',
    failureFlash: true
  })
)
app.get("/", (req,res) => {
 Produit.find({}).populate("categorie").populate("image").exec((err,produits)=>{
   console.log("hellooojk")
   console.log(produits)
  res.render("index",{produit: produits})
 })
})
app.get("/produitDetail/:_id", (req,res) => {
  Produit.findOne({_id: req.params._id}).populate("categorie").populate("image").exec((err,produits)=>{
    console.log("hellooojk")
    console.log(produits)
   res.render("produitDetail",{produit: produits})
  })
 })

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