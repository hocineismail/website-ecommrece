const express = require("express");
const client = express.Router();
const Lists = require("../../models/lists");
const async = require('async')

client.get("/Compte",(req,res)=> {
    res.render('Client/compteClient')
})


client.get("/List/achats",(req,res)=> {
    res.render('Client/itemProduit')
})
client.get("/D", (req,res) => {
    Lists.remove({}, (err, deletee) => {
        if (deletee) {
           console.log('suprimi')
        }
    })
    res.redirect("/")
    
})
client.post("/AddToList", async  (req, res) => {
    const produit = await Lists.findOne({Paye: false, produit: req.body._id, user: req.user._id})
    Lists.find({}, (err, ress ) => {
        console.log(ress)
    })
    if (produit) {
        Lists.findOne({Paye: false, produit: req.body._id, user: req.user._id}, (err, Exist) => {
            console.log(Exist)
            const Quantite =  parseInt(Exist.Quantite);
            Exist.Quantite =  Quantite + parseInt(req.body.Quantite);
            Exist.save();
            console.log(Exist)
            return
        })     
    } else  {
        const AddTList = new Lists({
            Quantite: req.body.Quantite,      
            produit: req.body._id,
            user: req.user._id   
        });AddTList.save((err, siccess) => {
            if (!siccess) {
                console.log("not saving")
            }
        })
    }


})
module.exports = client;