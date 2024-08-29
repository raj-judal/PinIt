const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require('jsonwebtoken');
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    // console.log(salt);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // console.log(hashedPassword);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.post("/login", async (req, res) => {
  try {
    // console.log(req);
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("Invalid Username or Password1");
    } else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(400).json("Invalid Username or Password");
      } else {
        res.status(200).json({ _id: user._id, username: user.username });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
