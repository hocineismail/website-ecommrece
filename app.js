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
const auth = require('./routes/auth/auth')
const client = require('./routes/client/client')
const Lists = require("./models/lists");
const User = require("./models/user");
mongoose.connect("mongodb://localhost:27017/projet-Unic");
var setUpPassport = require('./routes/setuppassport')


setUpPassport()
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

app.use(passport.initialize())
app.use(passport.session())



app.use(flash())


//using folder views
app.use(express.static(__dirname + '/public'))
app.engine('ejs', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(routesAdmin)
app.use(auth)
app.use(client)


app.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/routes',
    failureRedirect: '/login',
    failureFlash: true
  })
)


app.get("/", async (req,res) => {
 if (req.user) {

 if (req.user.user === "Client") {
  const IsActif = await User.findOne({_id: req.user._id}).populate('client')
  console.log(IsActif)
  if (IsActif.client.IsActif === true) {
    const categorie = await Categorie.find({})
  Produit.find({}).populate("categorie").populate("image").exec((err,produits)=>{
    if (req.user) {
   Lists.find({user: req.user._id, Paye: false}).populate({path: 'produit', populate: {path: 'image'} }).limit(3).exec((err,panier) => {
     console.log(panier)
   
     res.render("index",{categorie: categorie ,produit: produits, panier: panier})
   })  } else {
     res.render("index",{categorie: categorie ,produit: produits})
   }

  })
  } else {
   res.redirect("/NonActif")
  }
 }



 } else {
  const categorie = await Categorie.find({})
  Produit.find({}).populate("categorie").populate("image").exec((err,produits)=>{
    if (req.user) {
   Lists.find({user: req.user._id, Paye: false}).populate({path: 'produit', populate: {path: 'image'} }).limit(3).exec((err,panier) => {
     console.log(panier)
   
     res.render("index",{categorie: categorie ,produit: produits, panier: panier})
   })  } else {
     res.render("index",{categorie: categorie ,produit: produits})
   }

  })
}
})

app.post("/search", async (req, res) =>   {
 
  console.log(" ajax function")
 
  let categorie  = req.body.Categorie
   let max = req.body.Max
  let min = req.body.Min
  if 
    (req.body.Categorie != 'null')  {
      // Student.find({exams: {$elemMatch: { Grade: { $gt: 49, $lt: 120}, Exam: req.params._id}}  }).populate("user").exec()
 let findproduit = await Produit.find(  
{ Prix: { $gt: min, $lt: max}, categorie: categorie}).populate('image')
  console.log(findproduit)
   res.send(findproduit)
  
        
  } else  {
  res.send()
  }
})

app.get("/produitDetail/:_id",(req,res) => {
  if (req.user) {
    Produit.findOne({_id: req.params._id}).populate("categorie").populate("image").exec((err,produits)=>{
      Lists.find({user: req.user._id, Paye: false}).populate({path: 'produit', populate: {path: 'image'} }).limit(3).exec((err,panier) => {
        console.log(panier)
      
        res.render("produitDetail",{produit: produits, panier: panier})
      })
    })
  } else {
    Produit.findOne({_id: req.params._id}).populate("categorie").populate("image").exec((err,produits)=>{
      console.log("hellooojk")
      console.log(req.user)
     res.render("produitDetail",{produit: produits})
    })
  }
  
 })


app.get("/routes" , ensureAuthenticated,async (req,res)=>{
 console.log("routeess")
  console.log(req.user)
  if (req.user.user === "Client") {
     const IsActif = await User.findOne({_id: req.user._id}).populate('client')
     console.log(IsActif)
     if (IsActif.client.IsActif === true) {
      res.redirect("/")
     } else {
      res.redirect("/NonActif")
     }
  } else {
    res.redirect("/admin")
  }
})
app.get("/NonActif", (req,res) => {
  res.render('Client/nonactif')
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
 
  res.redirect("/login");
  }
 }
app.listen(3000, () => {
  console.log('Server listing on 3000')
})