var express = require("express");
var routesAdmin = express.Router();
var express = require("express");
var async =  require("async");

var User = require("../../models/user");


routesAdmin.get('/admin', (req,res )=> {
res.render("Admin/admin")
})



module.exports = routesAdmin;