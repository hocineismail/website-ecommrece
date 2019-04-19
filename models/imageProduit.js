


var mongoose = require("mongoose");

var Schema = mongoose.Schema
var imageSchema = Schema({
 Imageone: { type: String, required: true },
 Imagetwo: { type: String, required: true },
 Imagethee: { type: String, required: true },
 Imagefour: { type: String, required: true },


 createdAt: { type: Date, default: Date.now },
});

var ImageProduit = mongoose.model("ImageProduit", imageSchema);
module.exports = ImageProduit;