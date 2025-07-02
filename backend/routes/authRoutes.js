const express = require('express')
const {protect} = require('../middleware/authMiddleware.js')
const upload = require('../middleware/uploadMiddleware.js')

const {
    registerUser,
    loginUser,
    getUserInfo,
} = require('../controllers/authController.js')

const router  = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/getUser",protect, getUserInfo)

router.post('/upload-image',upload.single("image"),(req,res)=>{
    if(!req.file){
       return res.status(400).json({message:"No image uploaded"});
    }

    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    console.log(imageURL);
    res.status(200).json({imageURL})
})

module.exports = router