const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: "Product" },
  size: { type: String },
  price: { type: Number },
});

const Size = new mongoose.model("Size", sizeSchema);

module.exports = Size;
