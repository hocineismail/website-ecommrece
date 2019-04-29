const express = require("express");
const client = express.Router();
const Lists = require("../../models/lists")

client.get("/Compte",(req,res)=> {
    res.render('Client/compteClient')
})


client.get("/List/achats",(req,res)=> {
    res.render('Client/itemProduit')
})

client.post("/AddToList", (req, res) => {
    const AddTList = new Lists({
        Quantite: req.body.Quantite,      
        produit: req.body._id   
    });AddTList.save((err, siccess) => {
        console.log(siccess)
    })

})
module.exports = client;