import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { COLORS } from "../../utils/data";

export const RecentIncomeWithChart = ({ data, totalIncome }) => {

    const [chartData ,setChartData ] = useState([])

    const prepareChartData = () =>{
        const dataArr = data?.map((item)=>({
            name:item?.source,
            amount:item?.income,
        }))
        setChartData(dataArr)
    }

    useEffect(()=>{
        prepareChartData();
    },[data])


  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>
      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`$${totalIncome}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};
