import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import { API_PATH } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useUserAuth } from "../../hooks/userUseAuth";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IcomeList from "../../components/Income/IcomeList";
import DeleteAlert from "../../components/DeleteAlert";

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  //Get All Income Details
  const fetchIncomeData = async () => {
    if (loading) return;
    // console.log(user)
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong", error);
    } finally {
      setLoading(false);
    }
  };

  //Handle Add Income
  const handleAddIncome = async (data) => {
    const {source,income,date,icon} = data
    
    //validation checks
    if(!source.trim()){
      toast.error("Source is required.")
      return;
    }

    if(!income ||isNaN(income) || Number(income)<=0 ){
        toast.error("Income should be a valid number number, greater than 0.")
      return;
    }

    if(!date){
      toast.error("Date is required.")
      return;
    }

    try{
      await axiosInstance.post(API_PATH.INCOME.ADD_INCOME,{icon,source,income,date});

      setOpenAddIncomeModal(false)
      toast.success("Income added successfully");
      fetchIncomeData()
    }catch(error){
      console.error("Error adding income:",error.response?.data?.message||error.message);
    }
  };

  //Handle Delete Income
  const handleDeleteIncome = async (id) => {
    try{
      await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(id))
      setOpenDeleteAlert({show:false,data:null})
      toast.success("Income details deleted successfully")
      fetchIncomeData()
    }catch(error){
      console.error("Error deleting thhe income: ",error?.response?.data?.message||error.message)
    }

  };

  //Handle download income details
  const handleDownloadIncomeDetails = async () => {
     try{
      const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_INCOME,{
        responseType:"blob"
      });

      //create a URL for the blob 
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link= document.createElement("a");
      link.href = url
      link.setAttribute("download" , "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url)
    }catch(error){
      console.error("Error downloading income details: ",error);
      toast.error("Failed to download income details. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IcomeList
            transactions={incomeData}
            onDelete = {(id) => {setOpenDeleteAlert({show:true,data:id})}}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal 
          isOpen ={openAddIncomeModal}
          onClose={()=>{setOpenAddIncomeModal(false)}}
          title="Add Income"
        >
       <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>


        <Modal isOpen={openDeleteAlert.show}
          onClose={()=>{setOpenDeleteAlert({show:false,data:null})}}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete = {()=>{handleDeleteIncome(openDeleteAlert.data)}}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
