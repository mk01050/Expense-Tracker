const Expense = require('../models/Expense.js')
const xlsx = require("xlsx")


//Add Expense source
exports.addExpense= async(req,res) =>{
    const userId = req.user.id
    
    try{
    const {icon,category,amount,date} = req.body || {};

    //Validation check for empty feilds
    if(!category || !amount||!date){
        return res.status(400).json({message:"All fields are required"})
    }

    const newExpense = new Expense({
        userId,
        icon,
        category,
        amount,
        date:new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);


    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message})
    }
}

//Get All Expense source
exports.getAllExpense= async(req,res) =>{
    const userId = req.user.id
    

    try{
        const expense  = await Expense.find({userId}).sort({date:-1});
        res.json(expense);
    }catch(err){
        res.status(500).json({message:"Server Error"});
   }  
}

//Delete Expense source
exports.deleteExpense= async(req,res) =>{
    try{
        const income  = await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Expense deleted successfully"});
    }catch(err){
        res.status(500).json({message:"Server Error"});
   }  
}

//Download Excel for all the Expense
exports.downloadExpenseExcel= async(req,res) =>{
    const userId = req.user.id

    try{
        const expense = await Expense.find({userId}).sort({date:-1})

        const data = expense.map((item)=>({
            Category:item.category,
            Amount:item.amount,
            Date:item.date,
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Expense");
        xlsx.writeFile(wb,'expense_details.xlsx');
        res.download('expense_details.xlsx');
    
    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message});
    }
}