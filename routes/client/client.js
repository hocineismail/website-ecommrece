'use strict';

const express = require("express");
const client = express.Router();
const Lists = require("../../models/lists");
const async = require('async')
const Produit = require("../../models/produit")
const Commande = require("../../models/commande")
const flash = require("connect-flash"); 

client.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
   })
   
client.get("/Compte",ensureAuthenticated,(req,res)=> {
     
    if (req.user.user === "Client") {
        res.render('Client/compteClient')
	} else {
		res.redirect("/routes")
	}
   
})

client.get("/submitperone/:_id",ensureAuthenticated,(req,res)=> {
       
    if (req.user.user === "Client") {
        Lists.findOne({user: req.user._id, _id: req.params._id}, (err, Update) => {
            console.log(Update)
            Produit.findOne({_id: Update.produit}, (err, produit) => {
                if (produit) {
                    if (produit.Quantite >= Update.Quantite) {
                        let NewQuantete = produit.Quantite - Update.Quantite;
                        produit.Quantite = NewQuantete;
                        produit.save()
                        console.log(produit)
                        if (Update) {
                            Update.Paye = true;
                            Update.save((err , success) => {
                                if (!err) {
                                    Lists.find({user: req.user._id}).exec((err, listofuser) => {
                                        let newCommande = new Commande({
                                            User: req.user._id,
                                            list: listofuser,
            
                                         })
                                         newCommande.save()
                                    })
    
                                }
                            });
                            req.flash("info", "Updating ");
                            res.redirect("/List/achats")
                        } else  { 
                        req.flash("error", "ce User existe");
                        res.redirect("/List/achats")}
                    } else {
                        console.log(' quantite bzzzf')
                        req.flash("info", "cette quantite n existe pas");
                        res.redirect("/List/achats")
                    }
                }
            })
           
        })
	} else {
		res.redirect("/routes")
	}
 
})


client.post("/update/achat/:_id" ,ensureAuthenticated,(req, res) => {
  

    if (req.user.user === "Client") {
        Lists.findOne({user: req.user._id, _id: req.params._id}, (err, Update) => {
            console.log(Update)
     
            if (Update) {
                Update.Quantite = req.body.Quantite;
                Update.save();
                req.flash("info", "Updating ");
                res.redirect("/List/achats")
            } else  { 
            req.flash("error", "ce User existe");
            res.redirect("/List/achats")}
        })
	} else {
		res.redirect("/routes")
	}
   
    
})
client.get("/List/achats", ensureAuthenticated, (req,res)=> {

 
   
    if (req.user.user === "Client") {
      
    Lists.find({user: req.user._id}).populate({path: 'produit', populate: {path: 'image'} }).exec((err, lists) => {
        console.log(lists)
         if (lists) {
            res.render('Client/itemProduit', {List: lists})
        }
     })
	} else {
		res.redirect("/routes")
	}
   



   
})
client.get("/D", (req,res) => {
    Lists.remove({}, (err, deletee) => {
        if (deletee) {
           console.log('suprimi')
        }
    })
    res.redirect("/")
    
})
client.post("/AddToList", ensureAuthenticated , async  (req, res) => {

    if (req.user.user === "Client") {
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
	} else {
		res.redirect("/routes")
    }
    
   


})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    next();
    } else {
   
    res.redirect("/login");
    }
   }
module.exports = client;