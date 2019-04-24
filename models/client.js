


var mongoose = require("mongoose");

var Schema = mongoose.Schema
var clientSchema = Schema({
 IsActif: { type: Boolean, default: false },
 createdAt: { type: Date, default: Date.now },
 panier: {
    type: Schema.Types.ObjectId,
    ref: 'Panier'
  }
});

var Client = mongoose.model("Client", clientSchema);
module.exports = Client;