const express = require("express");
const bcrpty = require("bcrypt");
const UserModel = require("../model/User");

const router = express.Router();
router.use(express.json());

router.post("/adduser", async (req, res) => {
  console.log("Add user API is called");
  try {
    const { username, email, countryCode, phoneNumber, password } = req.body;

    if(!username || !email || !countryCode || !phoneNumber || !password){
      return res.json({ message: "Enter all field" })
    }
                                   
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.json({ message: "user already registered" });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.json({ message: "Please enter a valid email address" });
    }

    if (password.length < 8) {
      return res.json({ message: "Password should be atleast 8 characters" });
    }

    const Pattern = /^\d{10}$/;
    if(Pattern.length.test(phoneNumber)){
        return res.json({ message: "Phone number should be 10 digit" }); 
    }

    const hashpassword = await bcrpty.hash(password, 8);
    const newUser = new UserModel({
      username,
      email,
      countryCode,
      phoneNumber,
      password: hashpassword,
    });
    await newUser.save();
    console.log("new user is:", newUser);
    return res.json({ status: true, message: "Successfully new user add" });
  } catch (error) {
    console.log("Internal server error", error);
    return res
      .status(400)
      .json({ status: false, message: "Internal server error" });
  }
});

router.post("/login", async(req, res) => {
  console.log("Login API is called");
  try {
    const {fullname, password} = req.body;
    const id = req.params.id;

    if(!fullname || !password){
      return res.json({ message: "Enter all field" })
    }

    const user =  await UserModel.findOne({id})
    if(!user){
      return res.status(400).json({status: false, message: "User not registered"})
    }

    const validPassword = await bcrpty.compare(password, user.password);
    if(validPassword){
      return res.status(400).json({message: "Password is incorrect"})
    }
  } catch (error) {
    console.log("error is", error);
    res.status(400).json({message: "Internal server error"})
  }
})

router.delete("/softdeleteuser/:id", async (req, res) => {
  console.log("Delete API is called");
  try {
    const id = req.params.id;
    console.log("user id is", id);
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }
    user.isDeleted = true;
    user.deleteAt = new Date();
    await user.save();

    console.log("user is deleted:", user);
    return res.json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log("error is:", error);
    return res
      .status(400)
      .json({ status: "false", message: "Internal server error" });
  }
});

module.exports = router;
