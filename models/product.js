const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: [{ type: String }],
  quantity: { type: Number, default: 1 },
});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
