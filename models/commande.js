var mongoose = require("mongoose");
var Schema = mongoose.Schema
var commandeSchema = Schema({
 userclient: {
   type: Schema.Types.ObjectId,
   ref: 'User' 
},
cammande: { type: Boolean, default: false},
 createdAt: { type: Date, default: Date.now },
 list: [ {
    type: Schema.Types.ObjectId,
    ref: 'Lists' 
 }]
});

var Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;