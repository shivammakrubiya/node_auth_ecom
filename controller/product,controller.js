const product = require("../models/product");
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const Color = require("../models/color");
const Size = require("../models/size");
const Product = require("../models/product");

module.exports = {
  addProduct: async (req, res) => {
    try {
      const isUser = req.user;

      if (!isUser) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to add product",
        });
      }

      const { title, description, images, size, color, price, quantity } =
        req.body;

      if (!title || !description || !size || !color || !price) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }

      const isProductExist = await Product.findOne({ title });

      if (isProductExist) {
        const isColorExist = await Color.findOne({ color });
        const isSizeExist = await Size.findOne({ size });

        if (!isColorExist) {
          var newColor = await Color.create({
            productId: isProductExist._id,
            color,
            price,
          });
        }

        if (!isSizeExist) {
          var newSize = await Size.create({
            productId: isProductExist._id,
            size,
            price,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Product added successfully",
        });
      } else {
        var product = await Product.create({
          title,
          description,
          images,
          quantity,
        });

        if (product && product._id) {
          var colorData = await Color.create({
            productId: product._id,
            color,
            price,
          });
          var sizeData = await Size.create({
            productId: product._id,
            size,
            price,
          });
        }

        if (colorData.price == sizeData.price) {
          let payload = {
            title: product.title,
            description: product.description,
            images: product.images,
            quantity: product.quantity,
            color: colorData.color,
            size: sizeData.size,
            price: colorData.price,
          };
          return res.status(200).json({
            success: true,
            message: "Product added successfully",
            data: payload,
          });
        }
      }
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },
  allProducts: async (req, res) => {
    try {
      const isUser = req.user;

      if (!isUser) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to add product",
        });
      }

      const products = await Product.find({});

      let payload = [];
      for (let i = 0; i < products.length; i++) {
        const element = products[i];

        console.log(
          "=====================\n",
          element._id,
          "\n====================="
        );
        const color = await Color.find({ productId: element._id });
        const size = await Size.find({ productId: element._id });
        console.log(element);
        console.log("colors", color);
        console.log("sizes", size);

        payload.push({
          title: element.title,
          description: element.description,
          images: element.images,
          quantity: element.quantity,
          colors: color,
          sizes: size,
        });
      }

      res.status(200).json({
        success: true,
        data: payload,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
