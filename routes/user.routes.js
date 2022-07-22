const express = require("express");
const { addUser, login } = require("../controller/user.controller");
const routes = express.Router();

routes.post('/add', addUser);

routes.post("/login", login)

module.exports = {routes}