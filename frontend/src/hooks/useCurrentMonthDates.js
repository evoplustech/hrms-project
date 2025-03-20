
const CurrentMonthDates = ()=>{
// const [startDate,setStartDate] = useState();
// const [endDate,setEndDate] = useState();
const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const firstDayOfNext = new Date(today.getFullYear(), today.getMonth()+1, 1);
const lastDayOfMonth = new Date(firstDayOfNext-1);

return [firstDayOfMonth,lastDayOfMonth];

}

export default CurrentMonthDates;








