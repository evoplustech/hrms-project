
import { holidayModel } from "../../models/attendance/holiday.model.js";
import { dateFormating } from "../../helpers/dateFormating.js";


const getHolidayList = async (req,res) => {
    try {
        const  { startDate , endDate } = req.body;

        if(startDate>endDate){
            return res.status(200).json({success: false, message:"Invalid Date to search."})
        }

        const holidayListData = await holidayModel.find({ holidayDate : {$gte: new Date(startDate), $lte: new Date(endDate) } ,isActive: true});

        const holidayList = dataFormat(holidayListData);

        if(!holidayList.length){
            return res.status(200).json({success:false, message: "No Holiday Records Found"});
        }
        return res.status(200).json( { success: true, message:"Holiday List" , data:holidayList} );

    } catch (error) {
        console.log(`Error in the Holiday controller in getHolidayList function.${error.message}`);
        return res.status(409).json({ success: false, message: "Internal Server Error"});
    }
}

const addHoliday = async (req,res) => {
    try {
        const { _id="", holidayName, holidayDate, description, holidayType, recurring = false, method } = req.body;
        const {role,empId} = req;
        const {holidayForm}= req.body
        console.log(holidayForm);
        
        if(!['admin','hr'].includes(role.toLowerCase())){
            return res.status(200).json({ success: false, message: "Only Admin or Hr can Add / Edit the Holiday" });
        }
        if(method.toLowerCase() === "add" && _id === ""){
            const existHoliday = await holidayModel.findOne({ holidayDate, isActive:true});

            if(existHoliday){
                return res.status(200).json({ success: false, message: "This Holiday is already exist"});
            }

            const addLeave = new holidayModel({
                holidayName, holidayDate, description, holidayType, isRecurring: recurring, isActive:true
            });

            const addedLeave = await addLeave.save();
            const holidayList = dataFormat([addedLeave]);
            return res.status(200).json({ success: true, message: "Holiday Added Successfully", data: holidayList });

        }else if(method.toLowerCase() === 'update' && _id !== ""){
            const existHoliday = await holidayModel.findOne({_id,isActive:true});
            if(!existHoliday){
                return res.status(200).json({success: false, message: "The Holiday you are trying to update is not existing."});
            }
            const updateHoliday = await holidayModel.findByIdAndUpdate( {_id}, {$set:{holidayName, holidayDate, description, holidayType, isRecurring: recurring, isActive:true }}, {new:true});

            const holidayList = dataFormat([updateHoliday]);

            return res.status(200).json({ success: true, message: "Holiday Details Updated Successfully", data:holidayList });
        }
        return res.status(200).json({success: false, message: "Something went Wrong"})
    } catch (error) {
        console.log(`Error in the Holiday controller in addHoliday function.${error.message}`);
        console.log(error);
        return res.status(409).json({ success: false, message: "Internal Server Error"});
    }
}

const deleteHoliday = async (req,res) =>{
    try {
        const {_id} = req.body;
        const {role} = req;

        if(!['admin','hr'].includes(role.toLowerCase())){
            return res.status(200).json({ success: false, message: "Only Admin or Hr can Delete the Holiday" });
        }

        const holidayExist = await holidayModel.find({_id,isActive:true})

        if(!holidayExist.length){
            return res.status(200).json({ success: false, message:"This Holiday record not found" })
        }
        const deleteHoliday = await holidayModel.findByIdAndUpdate({_id}, {$set: { isActive:false } });
        return res.status(200).json({ success: true, message:"This Holiday record is Deleted Successfully.",data:{_id:deleteHoliday._id} });
    } catch (error) {
        console.log(`Error in the Holiday controller in deleteHoliday function.${error.message}`);
        return res.status(409).json({ success: false, message: "Internal Server Error"});
    }
}

const uploadHolidaySheet = async (req,res) => {
    try {
        const { data } = req.body;
        if(!data.length){
            return res.status(200).json({success:false,message: "The Data should not be empty."});
        }
        let newInsertData = [];
        let existingHolidayListArr = [];
        for(let i=0;i<data.length;i++){

            let exist = await holidayModel.find({holidayDate: new Date(data[i].holidayDate), isActive: true});
            if(!exist.length){
                newInsertData.push( data[i] );
            }else{
                existingHolidayListArr.push( data[i].holidayDate )
            }
        }
        const existingHolidayList = existingHolidayListArr.join(",");
        if(newInsertData.length !== 0 ){
            await holidayModel.insertMany(data);
            const year = new Date().getFullYear();
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;
            const holidayList = await holidayModel.find({ holidayDate : {$gte: new Date(startDate), $lte: new Date(endDate) } ,isActive: true});
            const holidayRecordFormat = dataFormat(holidayList);

            return res.status(200).json({
                success:true,
                message: "The Holiday List inserted succefully",
                data:holidayRecordFormat,
                existingHolidayList
            });
        }else{
            return res.status(200).json({success: true, message: "This List of Holidays is Already Inserted.",existingHolidayList});
        }

    } catch (error) {
        console.log(`Error in the Holiday controller in updateHoliday function.${error.message}`);
        return res.status(409).json({ success: false, message: "Internal Server Error" });
    }
}

function dataFormat(holidayListData){

    const formatData = holidayListData.map(holiday => {
        const holidayDate = dateFormating(holiday.holidayDate);

        const data = {
            _id: holiday._id,
            holidayName: holiday.holidayName,
            holidayDate: holidayDate,
            description: holiday.description,
            holidayType: holiday.holidayType,
            Recurring: holiday.isRecurring
        }
        return data;
    })
    return formatData;
}
export { getHolidayList, addHoliday, deleteHoliday, uploadHolidaySheet }


