const product = require("../models/product");
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const Color = require("../models/color");
const Size = require("../models/size");
const Product = require("../models/product");
const imageToBase64 = require("image-to-base64");

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

      const { title, description, size, color, price, quantity } = req.body;

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
        var url;
        if (req.file) {
          // Coverting Image to Url

          const imageUrl = await imageToBase64(req.file.path);

          url = `data:${req.file.mimetype};base64,${imageUrl}`;
        } else {
          return res.status(400).json({
            success: false,
            message: "Please upload an image",
          });
        }

        let newProductObj = {
          title: title,
          description: description,
          image: url,
          quantity: quantity,
        };

        var product = await Product.create(newProductObj);

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
            // image: product.image,
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

      const id = req.query.id;

      if (!isUser) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to get All products",
        });
      }

      if (id) {
        const product = await Product.findById({ _id: id });
        // console.log(product);
        const color = await Color.find({ productId: product._id });
        const size = await Size.find({ productId: product._id });

        let payload = {
          id: product._id,
          title: product.title,
          description: product.description,
          images: product.image,
          quantity: product.quantity,
          product: product.images,
          colors: color,
          sizes: size,
        };
        // console.log(payload);
        return res.status(200).json({
          success: true,
          data: payload,
        });
      }

      const products = await Product.find({});

      let payload = [];
      for (let i = 0; i < products.length; i++) {
        const element = products[i];

        const color = await Color.find({ productId: element._id });
        const size = await Size.find({ productId: element._id });

        payload.push({
          id: element._id,
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
      // console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const isUser = req.user;

      if (!isUser) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to Delete product",
        });
      }

      const { id } = req.query;

      if (!id) {
        const deleteAll = await Product.deleteMany({});
        await Color.deleteMany({});
        await Size.deleteMany({});
        if (deleteAll) {
          return res.status(200).json({
            success: true,
            message: "All Products deleted successfully",
          });
        }
      }

      const product = await Product.findByIdAndDelete({ _id: id });

      if (product) {
        await Color.deleteMany({ productId: id });
        await Size.deleteMany({ productId: id });

        return res.status(200).json({
          success: true,
          message: "Product deleted successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
