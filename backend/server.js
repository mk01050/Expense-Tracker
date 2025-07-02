require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path  = require('path')
const connectDB = require('./config/db.js')
const authRoutes = require('./routes/authRoutes.js')
const incomeRoutes = require('./routes/incomeRoutes.js')
const expenseRoutes = require('./routes/expenseRoutes.js')
const dashboardRoutes = require('./routes/dashboardRoutes.js')

const app = express();

app.use(
    cors(
        {
            origin:process.env.CLIENT_URL || "*",
            methods:['GET','POST','DELETE','PUT'],
            allowedHeaders:["Content-Type","Authorization"],

        }
    )
)
const PORT = 5000;
app.use(express.json())


connectDB();

// app.get('/',(req,res)=>{res.send("hello world")})

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/income',incomeRoutes)
app.use('/api/v1/expense',expenseRoutes)
app.use('/api/v1/dashboard',dashboardRoutes)

//Server uploads folder
app.use('/uploads',express.static(path.join(__dirname,"uploads")))

app.listen(PORT,()=>{
    console.log(`The server is running at port ${PORT}`)
})