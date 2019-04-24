var express = require("express");
var client = express.Router();

client.get("/Compte",(req,res)=> {
    res.render('Client/compteClient')
})
module.exports = client;