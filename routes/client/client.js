var express = require("express");
var client = express.Router();

client.get("/Compte",(req,res)=> {
    res.render('Client/compteClient')
})


client.get("/List/achats",(req,res)=> {
    res.render('Client/itemProduit')
})
module.exports = client;