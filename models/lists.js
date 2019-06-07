 const mongoose = require("mongoose");

const Schema = mongoose.Schema
const listSchema = Schema({
 Quantite: { type: Number, required: true },
 Paye: { type: Boolean, default: false},
 Commander: { type: Boolean, default: false},
 createdAt: { type: Date, default: Date.now },
 produit: {
    type: Schema.Types.ObjectId,
    ref: 'Produit'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

});

const Lists = mongoose.model("Lists", listSchema);
module.exports = Lists;