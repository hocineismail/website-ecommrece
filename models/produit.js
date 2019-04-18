


var mongoose = require("mongoose");

var Schema = mongoose.Schema
var produitSchema = Schema({
 Produit: { type: String, required: true },
 Prix: { type: Number, required: true },
 Description: { type: String, required: true },
 Note: {type: Number},
 Quantite: {type: Number, required: true},
 createdAt: { type: Date, default: Date.now },
 categorie: {
    type: Schema.Types.ObjectId,
    ref: 'Categorie'
  }
});

var Produit = mongoose.model("Produit", produitSchema);
module.exports = Produit;