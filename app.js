const express = require("express");
const mongoose = require("mongoose");
const { routes } = require("./routes/user.routes");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.get("/", (req, res) => {
  res.send({ success: true, message: "hello world" });
});

app.listen(process.env.PORT || 3000, async () => {
  await mongoose.connect("mongodb://localhost:27017/usersdb").then(() => {
    console.log("db connected");
  });
  console.log("server run at : - ", process.env.PORT);
});
