const express = require("express");
const {
  addProduct,
  allProducts,
  deleteProduct,
} = require("../controller/product.controller");
const { addUser, login, users } = require("../controller/user.controller");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/imageUpload");
const routes = express.Router();

/* ----------- User Routes  -------------- */

routes.post("/user/add", addUser);

routes.post("/user/login", login);

routes.get("/user/all", auth, users);

/* ----------- Product Routes  -------------- */

routes.post("/product/add", auth, upload.single("image"), addProduct);

routes.get("/product/all", auth, allProducts);

routes.delete("/product/delete", auth, deleteProduct);

module.exports = { routes };
