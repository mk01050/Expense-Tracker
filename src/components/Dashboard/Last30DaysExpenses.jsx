import React, { useEffect, useState } from 'react'
import { prepareExepenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({data}) => {
    const [chartData, setChartData] = useState([])

    useEffect(()=>{
        const result = prepareExepenseBarChartData(data);
        setChartData(result);
    },[data])

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>
      <CustomBarChart data={chartData}/>
      
    </div>
  )
}

export default Last30DaysExpenses