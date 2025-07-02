const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

//Generate token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Register user
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageURL } = req.body ;

  
  //Validtion for empty fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required! " });
  }

  try {
    //Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "The email is already in use" });
    }

    //Create a new user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageURL,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering the user", error: err.message });
  }
};

//Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body || {};

  //Validtion for empty fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required! " });
  }
  try {
    //Check if User exists and the password is correct
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //User is validated
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Logging the user", error: err.message });
  }

};

//Get Usrr info
exports.getUserInfo = async (req, res) => {
    try{
        const user= await User.findById(req.user.id).select("-password")

        if(!user){
            return res.status(404).json({message:"User not Found"})
        }

        res.status(200).json(user)
    }
    catch(err){
         res
      .status(500)
      .json({ message: "Error Logging the user", error: err.message });
    }
};
