const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const {auth}=require("express-oauth2-jwt-bearer")
const dotenv=require('dotenv');
dotenv.config();
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});
// GET all users (excluding password)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/googleLsogin", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { email, name, picture } = req.body;

    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = await User.create({ auth0Id, email, name, picture });
      console.log("New user created:", user.email);
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
