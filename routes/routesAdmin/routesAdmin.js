var express = require("express");
var routesAdmin = express.Router();
var express = require("express");
var async =  require("async");
const multer = require('multer');
var User = require("../../models/user");
const bodyParser = require("body-parser");
const path = require("path");
routesAdmin.get('/admin', (req,res )=> {
res.render("Admin/admin")
})

routesAdmin.get('/', (req,res )=> {
    res.render("index")
    })
routesAdmin.get('/ajouterProduit', (req,res )=> {
    res.render("Admin/ajouterProduit")
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
  {name: 'image5'},
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
               console.log(req.files.image1[0].filename)
              res.render('Admin/admin');
      
            }
          }
        });
      });
      
module.exports = routesAdmin;