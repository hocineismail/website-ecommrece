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
const ImageProduit = require('../../models/imageProduit')
routesAdmin.get('/admin', (req,res )=> {
res.render("Admin/admin")
})


routesAdmin.get('/ajouterProduit', (req,res )=> {
    Categorie.find({},(err,categories)=> {
        res.render("Admin/ajouterProduit",{categories: categories})
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
  
      
      routesAdmin.post('/AddProduit', (req, res) => {
      
        
      
        console.log("routes")
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
                   });NewProduit.save()
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
               });NewProduit.save()
              }
             
              
              res.render('Admin/admin');
      
            }
          }
        });
      });
      
module.exports = routesAdmin;