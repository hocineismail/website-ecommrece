


var mongoose = require("mongoose");

var Schema = mongoose.Schema
var commandeSchema = Schema({
 IsActif: { type: Boolean, default: false },
 createdAt: { type: Date, default: Date.now },
 list: {
    type: Schema.Types.ObjectId,
    ref: 'Lists' 
 },
 user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

var Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;