import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/userUseAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";

import IcomeList from "../../components/Income/IcomeList";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import DeleteAlert from "../../components/DeleteAlert";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import toast from "react-hot-toast";
import ExpenseList from "../../components/Expense/ExpenseList";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

     //Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;
    // console.log(user)
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE);

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    } finally {
      setLoading(false);
    }
  };

  //Handle add expense
  const handleAddExpense = async(expense)=>{
    const {category,amount,date,icon} = expense

    //validation checks
    if(!category.trim()){
      toast.error("Category is required.")
      return;
    }

    if(!amount ||isNaN(amount) || Number(amount)<=0 ){
        toast.error("Expense Amount should be a valid number number, greater than 0.")
      return;
    }

    if(!date){
      toast.error("Date is required.")
      return;
    }

    try{
      await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE,{icon,category,amount,date});

      setOpenAddExpenseModal(false)
      toast.success("Expense added successfully");
      fetchExpenseDetails()
    }catch(error){
      console.error("Error adding expense:",error.response?.data?.message||error.message);
    }
  }

  //Hanlde Delete Expense
  const handleDeleteExpense = async(id) =>{
    try{
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show:false,data:null})
      toast.success("Expense details deleted successfully")
      fetchExpenseDetails();

    }catch(error){
      console.error("Error deleting the expense: ",error?.response?.data?.message||error.message)
    }
  }

  //Handle Download Expense details
  const handleDownloadExpenseDetails = async()=>{
    try{
      const response = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXPENSE,{
        responseType:"blob"
      });

      //create a URL for the blob 
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link= document.createElement("a");
      link.href = url
      link.setAttribute("download" , "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url)
    }catch(error){
      console.error("Error downloading expense details: ",error);
      toast.error("Failed to download expense details. Please try again.");
    }
  }


  useEffect(()=>{fetchExpenseDetails()},[]);
  
  return (
     <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete = {(id) => {setOpenDeleteAlert({show:true,data:id})}}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen ={openAddExpenseModal}
          onClose={()=>{setOpenAddExpenseModal(false)}}
          title="Add Expense"
        >
       <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Modal>


        <Modal isOpen={openDeleteAlert.show}
          onClose={()=>{setOpenDeleteAlert({show:false,data:null})}}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete = {()=>{handleDeleteExpense(openDeleteAlert.data)}}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
