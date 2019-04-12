var express = require("express");
var routesAdmin = express.Router();
var express = require("express");
var async =  require("async");

var User = require("../../models/user");


routesAdmin.get('/', (req,res )=> {
res.render("Admin/admin")
})



module.exports = routesAdmin;