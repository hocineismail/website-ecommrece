 const mongoose = require("mongoose");

const Schema = mongoose.Schema
const listSchema = Schema({
 Quantite: { type: Number, required: true },
 createdAt: { type: Date, default: Date.now },
 produit: {
    type: Schema.Types.ObjectId,
    ref: 'Produit'
  },

});

const Lists = mongoose.model("Lists", listSchema);
module.exports = Lists;