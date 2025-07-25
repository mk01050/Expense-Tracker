const Income = require('../models/Income.js')
const xlsx = require("xlsx")


//Add income source
exports.addIncome= async(req,res) =>{
    const userId = req.user.id
    
    try{
    const {icon,source,income,date} = req.body || {};

    //Validation check for empty feilds
    if(!source || !income||!date){
        return res.status(400).json({message:"All fields are required"})
    }

    const newIncome = new Income({
        userId,
        icon,
        source,
        income,
        date:new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);


    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message})
    }
}

//Get All income source
exports.getAllIncome= async(req,res) =>{
    const userId = req.user.id
    

    try{
        const income  = await Income.find({userId}).sort({date:-1});
        res.json(income);
    }catch(err){
        res.status(500).json({message:"Server Error"});
   }  
}

//Delete income source
exports.deleteIncome= async(req,res) =>{
    try{
        const income  = await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Income deleted successfully"});
    }catch(err){
        res.status(500).json({message:"Server Error"});
   }  
}

//Download Excel for all the income
exports.downloadIncomeExcel= async(req,res) =>{
    const userId = req.user.id

    try{
        const income = await Income.find({userId}).sort({date:-1})

        const data = income.map((item)=>({
            Source:item.source,
            Amount:item.income,
            Date:item.date,
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Income");
        xlsx.writeFile(wb,'income_details.xlsx');
        res.download('income_details.xlsx');
    
    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message});
    }
}