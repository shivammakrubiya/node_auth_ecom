const User = require("../models/user");
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  addUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const encryptPassword = cryptojs.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString();
      console.log(encryptPassword);

      let object4UserAdd = {
        username: username,
        email: email,
        password: encryptPassword,
      };
      if (!username || !email || !password) {
        return res
          .status(400)
          .send({ success: false, message: "All feild is required" });
      }

      const isUserExist = await User.findOne({ email: email });

      if (isUserExist) {
        return res
          .status(400)
          .send({ message: false, message: "Email  is already exist" });
      }

      const userData = await User.create(object4UserAdd);
      res.status(201).send({ success: true, data: userData });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const findUserData = await User.findOne({ email: email });

      if (!findUserData) {
        return res
          .status(400)
          .send({ success: false, message: "Please Reegistration First" });
      }

      if (findUserData && findUserData.password) {
        var bytes = cryptojs.AES.decrypt(
          findUserData.password,
          process.env.SECRET_KEY
        );
        var originalPassword = bytes.toString(cryptojs.enc.Utf8);
        console.log("=======================>", originalPassword);
        if (originalPassword == password) {
          // CReate Token

          const token = jwt.sign(
            { id: findUserData._id, email },
            process.env.JWT_SECRET
          );

          return res
            .status(200)
            .send({ success: true, message: "User Login Successfully", token : token }, );
        } else {
          return res
            .status(200)
            .send({ success: true, message: "Invalid Credential" });
        }
      }
    } catch (error) {
      console.log(error);
      res.send({ success: false, error: error });
    }
  },
};
