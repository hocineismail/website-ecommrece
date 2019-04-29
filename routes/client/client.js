const express = require("express");
const client = express.Router();
const Lists = require("./models/lists")
client.get("/Compte",(req,res)=> {
    res.render('Client/compteClient')
})


client.get("/List/achats",(req,res)=> {
    res.render('Client/itemProduit')
})
module.exports = client;