const express = require("express");
const { addProduct, allProducts } = require("../controller/product,controller");
const { addUser, login, users } = require("../controller/user.controller");
const auth = require("../middleware/auth");
const routes = express.Router();

/* ----------- User Routes  -------------- */

routes.post("/user/add", addUser);

routes.post("/user/login", login);

routes.get("/user/all", auth, users);

/* ----------- Product Routes  -------------- */

routes.post("/product/add", auth, addProduct);

routes.get("/product/all", auth, allProducts);

module.exports = { routes };
