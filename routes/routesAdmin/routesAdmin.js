var express = require("express");
var routesAdmin = express.Router();
var express = require("express");
var async =  require("async");
const multer = require('multer');
var User = require("../../models/user");
const bodyParser = require("body-parser");
const path = require("path");
const Categorie = require('../../models/categorie')
const Produit = require('../../models/produit')
const Client = require('../../models/client')
const Commande = require('../../models/commande')
const ImageProduit = require('../../models/imageProduit')

routesAdmin.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
 })

routesAdmin.get('/ajouterProduit',ensureAuthenticated, (req,res )=> {
  if (req.user.user === "Admin") {
    Categorie.find({},(err,categories)=> {
      res.render("Admin/ajouterProduit",{categories: categories})
  })
} else {
res.redirect("/routes")
}

 
   
    })


    routesAdmin.get('/UserAdmins',ensureAuthenticated, (req,res )=> {
      
    if (req.user.user === "Admin") {
      
  
      User.find({user: "Admin"},(err,user)=> {
        console.log(user)
          res.render("Admin/userAdmins",{user: user})
      })
     
  } else {
  res.redirect("/routes")
  }


        })
        
routesAdmin.get("/admin/Demande",ensureAuthenticated, async (req, res) => {

  if (req.user.user === "Admin") {
    Commande.find({}).populate('userclient').exec((err, lists) => {
      console.log(lists)
     res.render("Admin/demande", {List: lists})
    })
   
} else {
res.redirect("/routes")
}




 
})

routesAdmin.get("/commande/:id", (req, res) => {
  Commande.findOne({_id: req.params.id}, (err, ress) => {
    if (!err) {
        ress.cammande = true
        ress.save().then(
          res.redirect('/admin/Demande')
        )

    }
  })
})


routesAdmin.get("/DeleteAdmin/:_id",ensureAuthenticated,(req,res)=>{

  if (req.user.user === "Admin") {
  
    User.findOneAndDelete({_id: req.params._id},(err,DELETED)=> {
      if (err) { 
        req.flash("error", "il ya une erreur ");
        return res.redirect("/UserAdmins")}
       else {
        req.flash("info", "Admin est suppremer");
        return res.redirect("/UserAdmins")
       }
    })
} else {
res.redirect("/routes")
}



})

routesAdmin.get("/ClientActif/:_id",ensureAuthenticated, (req,res)=> {
  
  if (req.user.user === "Admin") {
    Client.findOne({_id: req.params._id},(err,CLIENT)=> {
      if (CLIENT) {
        if (CLIENT.IsActif) {
          CLIENT.IsActif = false
          CLIENT.save()
        } else {
          CLIENT.IsActif = true
          CLIENT.save()
        }
        req.flash("info", "change d etat ");
        res.redirect("/UserClients")
      } else {
        req.flash("error", "il ya une erreur ");
        res.redirect("/UserClients")
      }
    })
} else {
res.redirect("/routes")
}




})

routesAdmin.get('/UserClients', ensureAuthenticated, (req,res )=> {



if (req.user.user === "Admin") {
  User.find({user: "Client"}).populate('client').exec((err,client)=> {
    console.log(client)
      res.render("Admin/userClients",{client: client})
  })
} else {
res.redirect("/routes")
}



 
 
  })

  routesAdmin.get("/DeleteClient/:_id",ensureAuthenticated,(req,res)=>{

    if (req.user.user === "Admin") {
     
  
  
    User.findOneAndDelete({_id: req.params._id},(err,DELETED)=> {
      if (err) { 
        req.flash("error", "il ya une erreur ");
        return res.redirect("/UserClients")
      }
       else {

        req.flash("info", "Client est suppremer");
        return res.redirect("/UserClients")
       }
    })
  } else {
    res.redirect("/routes")
    }
    
  

  })
  routesAdmin.post('/modiferProduit/:_id', ensureAuthenticated, (req,res )=> {
   Produit.findOne({_id: req.params._id},(err, produit) => {
     if (produit) {
       produit.produit = req.body.produitname;
       produit.Prix = req.body.prix;
       if (req.body.NewCategorie === "null") {
        produit.categorie = req.body.categorie;
        
       } else {
     
                var nweCategorie = new Categorie({
                    Categorie: req.body.NewCategorie
                })
                nweCategorie.save().then(
                  produit.categorie = nweCategorie._id
                )
       }
     
       produit.Quantite =req.body.quantite;
       produit.Description = req.body.description;
     };produit.save((err, update) => {
       if (update) {
         console.log("the produit has been update")
        res.redirect('/admin')       }
     })
   })
  })


    routesAdmin.get('/admin', ensureAuthenticated, (req,res )=> {

      if (req.user.user === "Admin") {
        Produit.find({}).populate('categorie').populate('image').exec((err,Produits)=> {
          res.render("Admin/listProduit",{produits: Produits})
      })
      } else {
        res.redirect("/routes")
        }
        
       
       
        }) 

  routesAdmin.get('/DeleteProduit/_id',ensureAuthenticated,(req, res) => {
      Produit.findOneAndDelete({_id: req.params._id},(err,success)=> {
          if (success) {
              res.redirect("/admin")
          }
      })
  })      
//this code for uplauding the file of produit
  // Init Upload


  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  routesAdmin.use(express.static(__dirname + '/public'))


const upload = multer({storage: storage, limits: { fileSize: 50000000 },
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }}).fields([
  {name: 'image1'}, 
  {name: 'image2'},
  {name: 'image3'},
  {name: 'image4'},
  ])
  
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  
      
      routesAdmin.post('/AddProduit',ensureAuthenticated, (req, res) => {
        upload(req, res, (err) => {
          if(err){
            res.render('Admin/admin');
             console.log('Error: of Uploading')
          } else {
            if(req.files == undefined){
                console.log('Error: No File Selected!')
              res.render('Admin/admin');
      
            } else {
              console.log('File Uploaded!')
              if (req.body.NewCategorie != "") {
                  var categorie = req.body.NewCategorie;
                var nweCategorie = new Categorie({
                    Categorie: req.body.NewCategorie
                })
                nweCategorie.save()
                var newImage = new ImageProduit({
                   Imageone: req.files.image1[0].filename,
                   Imagetwo: req.files.image2[0].filename,
                   Imagethee: req.files.image3[0].filename,
                   Imagefour: req.files.image4[0].filename,
                 
                });newImage.save()
                var NewProduit = new Produit({
                    Produit: req.body.produit,
                    Prix: req.body.prix,
                    categorie: nweCategorie._id,
                    Quantite: req.body.quantite,
                    image: newImage._id,
                    Description: req.body.description
                   });NewProduit.save().then(
                    res.redirect('/admin')
                   )
              } else { 
                var newImage = new ImageProduit({
                    Imageone: req.files.image1[0].filename,
                    Imagetwo: req.files.image2[0].filename,
                    Imagethee: req.files.image3[0].filename,
                    Imagefour: req.files.image4[0].filename,
                  
                 });newImage.save()
                 console.log(req.files.image2[0].filename)
               var NewProduit = new Produit({
                Produit: req.body.produit,
                Prix: req.body.prix,
                categorie: req.body.categorie,
                Quantite: req.body.quantite,
                image: newImage._id,
                Description: req.body.description
               });NewProduit.save().then(
                res.redirect('/admin')
               )
              }
             
              
            
      
            }
          }
        });
      });
      function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
        next();
        } else {
         
        res.redirect("/login");
        }
         }


         
module.exports = routesAdmin;