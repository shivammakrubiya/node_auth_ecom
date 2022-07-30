const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: "Product" },
  color: { type: String },
  price: { type: Number },
  image: [{ type: String }],
});

const Color = new mongoose.model("Color", colorSchema);

module.exports = Color;
