import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import {
  prepareExepenseBarChartData,
  prepareExepenseLineChartData,
} from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExepenseLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Expense Overview</h5>
           <p className="text-xs text-gray-400 mt-0.5">
            Track your spending trends over item and gain insight into where your money goes.
          </p>
        </div>
        <button className="add-btn" type="button" onClick={onAddExpense}>
          <LuPlus className="text-base" /> Add Expense
        </button>
      </div>

      <div className="mt-10">
        <CustomLineChart data={chartData}/>

      </div>
    </div>
  );
};

export default ExpenseOverview;
