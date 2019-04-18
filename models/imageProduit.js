


var mongoose = require("mongoose");

var Schema = mongoose.Schema
var imageSchema = Schema({
 Image1: { type: String, required: true },
 Image2: { type: String, required: true },
 Image3: { type: String, required: true },
 Image4: { type: String, required: true },
 Image5: { type: String, required: true },

 createdAt: { type: Date, default: Date.now },
});

var ImageProduit = mongoose.model("ImageProduit", imageSchema);
module.exports = ImageProduit;