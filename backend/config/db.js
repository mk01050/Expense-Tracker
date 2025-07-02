const mongoose = require('mongoose')


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL,{});
        console.log("Mongoose database connected")
        
    }
    catch(err){
        console.log("Error connecting to Mongo",err)
        process.exit(1);

    }
}

module.exports = connectDB