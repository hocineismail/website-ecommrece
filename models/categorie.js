var mongoose = require("mongoose");

var Schema = mongoose.Schema
var categorieSchema = Schema({
 Categorie: { type: String, required: true },
 createdAt: { type: Date, default: Date.now },
 
});

var Categorie = mongoose.model("Categorie", categorieSchema);
module.exports = Categorie;