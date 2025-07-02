import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+$/;

  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : `${formattedInteger}`;
};

export const prepareExepenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item.category,
    amount: item.amount,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {

  const sortedData = [...data].sort((a,b)=>new Date(a.date) -new Date(b.date))
  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    category: item.source,
    amount: item.income,
  }));
  return chartData;
};

export const prepareExepenseLineChartData=(data=[])=>{

  const sortedData = [...data].sort((a,b)=>new Date(a.date) -new Date(b.date))

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM YYYY"),
    category: item.category,
    amount: item.amount,
  }));
  return chartData
}