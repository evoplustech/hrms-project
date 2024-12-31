
import leaveModel from "../../models/attendance/leave.model.js";
import leaveTypeModel from "../../models/attendance/leaveType.model.js";
import employeeProfessionalModel from "../../models/employee/EmployeeProfessional.model.js";


const getLeaveDetails = async (req,res)=>{
    try {
        const { role, empId } = req;

        console.log(role,empId)
        if( role.toLowerCase() === 'employee' ){
            const leaveDetails = await leaveModel.find({ employeeId: empId })
            return res.status(200).json({leaveDetails})
        }else if(role.toLowerCase() === 'manager'){
            console.log("MAANGER TUE")
            const employeeDetails = await employeeProfessionalModel.find({ 'reportingManager.managerId' : '67286a64b5f3b4fc1b810ffa' })
            console.log(employeeDetails)
        }
        
        return res.status(200).json({role,empId})

    } catch (error) {
        console.log("Error in get Leave Details function in leave controller ::" + error.message)
        return res.status(409).json({ success: false, message: "Internal Server Error"})
    }
}
const applyLeave = async (req, res) => {

    try {
        const { employeeId, leaveTypeId, startDate, startDatetype, endDate, endDatetype, reason, status = "Pending", approvedBy, approvedOn, isActive } = req.body;
        const { role } = req;
        const start     = parseDate(startDate);
        const end       = parseDate(endDate);
        let daysCount = compareDates(start, end, startDatetype, endDatetype);

        const leaveType = (await leaveTypeModel.findOne( { _id: leaveTypeId } )).leaveType;
        const holidayList = [{ "holidayName" : "Test", "holidayDate": "2024-12-25", "description": "Christmas" },{ "holidayName" : "Test", "holidayDate": "2024-08-15", "description": "Christmas" },{ "holidayName" : "Test", "holidayDate": "2024-11-26", "description": "Christmas" }]

        // if(['admin','hr','manager'].includes(role.toLowerCase())) return res.status(400).json({ success:false, message:`The ${role} can't apply leave.` })

        // const cancelOrRejectStatuses = ["Cancelled", "Rejected"];

        // if (start.getDay() > end.getDay()) {
        //     return res.status(400).json({
        //         error: 'Leave from Friday to Monday is not allowed. Please choose different dates.'
        //     });
        // }

        if(typeof(daysCount) === 'string'){
            return res.status(400).json({ success: false, error: daysCount });
        }

        const appliedLeave = await leaveModel.find({
            employeeId,
            startDate: { $lte: new Date(end), $gte: new Date(start) },
            endDate: {  $lte: new Date(end), $gte: new Date(start) },
            status: { $in: ['Approved', 'Pending'] }
        });

        if (appliedLeave.length !== 0 ) {
            return res.status(409).json({
                success: false,
                error: "Leave cannot be applied because a previous leave is still in a pending or approved state."
            });
        }

        let current_date = new Date();
        let leaveApplyStartDate = new Date( leaveType.toLowerCase() === 'casualleave' ? start : end );
        let diffInMilliseconds = leaveApplyStartDate.setHours(0, 0, 0, 0) - current_date.setHours(0, 0, 0, 0);
        let diffInDays = Math.floor( diffInMilliseconds / (1000 * 60 * 60 * 24) );
        let dayofDate = (leaveType.toLowerCase() === 'casualleave')?start.getDay():end.getDay();
        console.log(diffInDays)
        if(leaveType.toLowerCase() === 'casualleave' && diffInDays < 7 ) return res.status(200).json({ success:false, error : "Casual Leave request should be submitted 7 Days Before Taking Leave" })

        if(leaveType.toLowerCase() === 'sickleave'){ 

            const absDiff = Math.abs(diffInDays);

            // Check for conditions related to submitting the leave request after taking leave
            const invalidCondition = 
                (dayofDate === 4 && absDiff > 4) || 
                (dayofDate === 5 && absDiff > 5) || 
                (absDiff > 2 && dayofDate !== 4 && dayofDate !== 5);

            if (invalidCondition) {

                return res.status(200).json({
                    success: false, 
                    error: "Sick Leave request should be submitted 2 Working Days After Taking Leave."
                });
            }

        }

        const holiday_count = holidayList.filter( (holiday) => {

            const date = new Date(holiday.holidayDate)
            if(date >= start && date <= end )
            {
                return holiday.holidayDate
            }
        });

        if( holiday_count.length > 0 ) daysCount -= holiday_count.length;

        if (start > end || daysCount === -1) {
            return res.status(400).json({ success: false, error: "Start date must be less than end date." });
        }

        const [empDetail] = await employeeProfessionalModel.find({ _id: employeeId, isActive: true });
        if (!empDetail) return res.status(404).json({ success: false, error: "Employee not found." });

        const { leaveBalances } = empDetail;
        const availableLeave = leaveBalances[leaveType] || 0;

        if(['sickLeave', 'casualLeave'].includes(leaveType)){
            if (availableLeave <= 0 || daysCount > availableLeave) {
                return res.status(400).json({
                    success: false,
                    error: `Your ${leaveType} balance is insufficient. Available: ${availableLeave}, Requested: ${daysCount}.`
                });
            }
        }

        const newLeaveApply = new leaveModel({
            employeeId,
            leaveTypeId,
            startDate: start,
            startDatetype,
            endDate: end,
            endDatetype,
            daysCount,
            reason,
            status,
            appliedOn: new Date(),
            approvedBy,
            approvedOn,
            isActive
        });

        await newLeaveApply.save();

        return res.status(201).json({ success: true, leaveId: newLeaveApply._id , message: "Leave Applied Successfully."});
    } catch (error) {
        console.error("Error applying leave:", error.message);
        return res.status(500).json({ success: false, error: "Failed to apply leave. Please try again later." });
    }
};

const leaveAction = async (req, res) => {
    try {
        const { leaveId, action } = req.body;
        const { role,empId } = req;

        if(!['pending','cancelled','rejected','approved'].includes(action.toLowerCase())) return res.status(409).json({success:false, message: "Invalid Action or leave Status." })
        // Check role authorization
        if (!['hr', 'admin', 'manager', 'tl'].includes(role.toLowerCase())) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to approve your own leave request."
            });
        }

        // Find leave details
        const leaveDetails = await leaveModel.findById(leaveId);
        if (!leaveDetails) {
            return res.status(400).json({ success: false, message: "Leave request not found or not pending." });
        }

        // Prevent duplicate actions
        if ((leaveDetails.status).toLowerCase() === action.toLowerCase()) {
            return res.status(400).json({ success: false, message: `This leave request has already been ${action}.` });
        }

        let { employeeId, daysCount, leaveTypeId, status, startDate, endDate } = leaveDetails;

        const [empDetail, leaveType] = await Promise.all([
            employeeProfessionalModel.findOne({ _id: employeeId, isActive: true }),
            leaveTypeModel.findById(leaveTypeId)
        ]);

        if (!empDetail || !leaveType) {
            return res.status(404).json({ success: false, message: "Employee or Leave type not found." });
        }

        // Adjust leave balance based on action
        const availableLeave = empDetail.leaveBalances[leaveType.leaveType] || 0;
        let leaveAdjustment = null;

        // console.log(startDate.getDay(),endDate.getDay(),leaveType.leaveType)
        if ( startDate.getDay() > endDate.getDay() && ['sickleave','casualleave'].includes( leaveType.leaveType.toLowerCase() ) ) {
            if ((status.toLowerCase() !== 'approved' && action.toLowerCase() === 'approved')) {
                daysCount -= 2;
            }else if((status.toLowerCase() === 'approved' && action.toLowerCase() !== 'approved')){
                daysCount += 2;
            }
        }

        if (['approved', 'rejected', 'cancelled'].includes(action.toLowerCase())) {
            leaveAdjustment = ['sickLeave', 'casualLeave'].includes(leaveType.leaveType)
                ? (action.toLowerCase() === 'approved' ? availableLeave - daysCount : availableLeave + daysCount)
                : (action.toLowerCase() === 'approved' ? availableLeave + daysCount : availableLeave - daysCount);
        }
        // console.log(availableLeave)
        // console.log(daysCount)
        // console.log(leaveAdjustment)

        if ((status.toLowerCase() !== 'approved' && action.toLowerCase() === 'approved') || 
            (status.toLowerCase() === 'approved' && action.toLowerCase() !== 'approved')) {
            await employeeProfessionalModel.findByIdAndUpdate(employeeId, {
                $set: { [`leaveBalances.${leaveType.leaveType}`]: leaveAdjustment }
            });
        }

        // Update leave request status
        await leaveModel.findByIdAndUpdate(leaveId, { $set: { status: action,approvedBy:empId,daysCount: daysCount} });

        return res.status(200).json({ success: true, message: `Leave ${action} updated successfully.` });
    } catch (error) {
        console.error("Leave Action Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const cancelLeave = async (req, res) => {
    try {
        const { leaveId } = req.body;

        // Check if leave exists and has "Pending" status in one query
        const leaveExist = await leaveModel.findOneAndUpdate(
            { _id: leaveId, status: "Pending" },  // Query
            { $set: { status: "Cancelled" } },    // Update operation
            { new: true }                         // Return the updated document
        );

        // If no document is found, return an error
        if (!leaveExist) {
            return res.status(400).json({ success: false, message: "The leave request could not be found." });
        }

        // Return success message with updated leave data
        return res.status(200).json({ success: true, message: "Your leave has been cancelled successfully." });

    } catch (error) {
        console.log(`Error in the Cancel Leave Controller :: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const addLeaveType = async (req, res) => {
    try {
        const { leaveType } = req.body;
        const existLeaveType = await leaveTypeModel.find({leaveType:leaveType});

        if(existLeaveType.length !== 0 ){
            return res.status(400).json({ success:false, error: "Leave Type already exist"})
        }
        await leaveTypeModel({leaveType:leaveType}).save();
        return res.status(200).json({ success:true, error: "Leave Type added Successfully"})

    } catch (error) {
        console.log("Error in Add Leave Type Controller :: " + error.message )
        return res.status(400).json({ success:false, error: "Internal Server Error" })
    }
}

// function compareDates(startDate, endDate, startDatetype, endDatetype) {
//     // Create Date objects from the provided startDate and endDate
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     // Normalize the start and end dates by setting the time to 00:00:00
//     start.setHours(0, 0, 0, 0);
//     end.setHours(0, 0, 0, 0);

//     // Ensure both start and end are valid Date objects before proceeding
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return "Invalid date input";  // Invalid date input
//     }

//     if (start.getTime() === end.getTime()) {
//         if (startDatetype === 'Half Day Morning' && endDatetype === 'Half Day Afternoon') {
//             return 1;
//         }

//         if (startDatetype === endDatetype) {
//             // If the types match, return 0.5 for half-day types or 1 for full-day types
//             return ['Half Day Morning', 'Half Day Afternoon'].includes(startDatetype) ? 0.5 : 1;
//         }
//     }


//     // If the end date is later than the start date, calculate the difference
//     if (end > start) {

//         let diffDays = (end - start) / (1000 * 3600 * 24);  // Difference in full days

//         // If the start and end are on different days, account for partial days
//         if (startDatetype === 'Half Day Afternoon' && endDatetype === "Half Day Morning") {
//             return 1;  // Special case: Full day between Half Day Afternoon and Half Day Morning
//         }

//         // If the difference is more than one full day, calculate accordingly
//         if (diffDays >= 2) {
//             // Invalid combinations (check for startDatetype and endDatetype)
//             const invalidCombinations = [
//                 ["Full Day", "Half Day Afternoon"],
//                 ["Half Day Morning", "Full Day"],
//                 ["Half Day Morning", "Half Day Afternoon"],
//                 ["Half Day Afternoon", "Half Day Afternoon"]
//             ];

//             // Check if the combination exists in the invalidCombinations array
//             if (invalidCombinations.some(([startType, endType]) => startDatetype === startType && endDatetype === endType)) {
//                 return "This combination can't be applied.";  // Invalid combination
//             }

//             // Valid combinations for 1.5 days
//             if ((startDatetype === "Full Day" && endDatetype === "Half Day Morning") || 
//                 (startDatetype === "Half Day Afternoon" && endDatetype === "Full Day")) {
//                 return 1.5;  // Full Day + Half Day Morning = 1.5 days
//             }

//             // Invalid combination for Half Day Morning + Half Day Afternoon
//             if (startDatetype === "Half Day Morning" && endDatetype === "Half Day Afternoon") {
//                 return "This combination can't be applied.";
//             }

//             // Subtract half day for both start and end dates if applicable
//             if (['Half Day Morning', 'Half Day Afternoon'].includes(startDatetype)) diffDays -= 0.5;
//             if (['Half Day Morning', 'Half Day Afternoon'].includes(endDatetype)) diffDays -= 0.5;
//             return Math.ceil(diffDays);  // Round up the difference in days
//         }
//     }

//     return -1;  // Return -1 if the end date is before the start date
// }

function compareDates(startDate, endDate, startDatetype, endDatetype) {
    // Create Date objects from the provided startDate and endDate
    if( !['full day','half day morning','half day afternoon'].includes(startDatetype.toLowerCase()) || !['full day','half day morning','half day afternoon'].includes(endDatetype.toLowerCase()) ) return "Not valid start and end type";
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize the start and end dates by setting the time to 00:00:00
    // start.setHours(0, 0, 0, 0);
    // end.setHours(0, 0, 0, 0);


    // Ensure both start and end are valid Date objects before proceeding
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "Invalid date input";  // Invalid date input
    }

    if (start.getTime() === end.getTime()) {

        if (endDatetype === 'Half Day Morning' && startDatetype === 'Half Day Afternoon') {
            return "Invalid Date and type combination";
        }

        if (startDatetype === 'Half Day Morning' && endDatetype === 'Half Day Afternoon') {
            return 1;
        }

        if (startDatetype === endDatetype) {
            // If the types match, return 0.5 for half-day types or 1 for full-day types
            return ['Half Day Morning', 'Half Day Afternoon'].includes(startDatetype) ? 0.5 : 1;
        }
    }else if(start<end){

        const invalidCombinations = [
            ["Full Day", "Half Day Afternoon"],
            ["Half Day Morning", "Full Day"],
            ["Half Day Morning", "Half Day Afternoon"],
            ["Half Day Afternoon", "Half Day Afternoon"],
            ["Half Day Morning", "Half Day Morning"]
        ];

        if (invalidCombinations.some(([startType, endType]) => startDatetype.toLowerCase() === startType.toLowerCase() && endDatetype.toLowerCase() === endType.toLowerCase())) {
            return "This combination can't be applied.";
        }


        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        let dayCount = Math.abs( (start - end) / (1000 * 60 * 60 * 24) ) + 1;

        if(['half day afternoon',"half day morning"].includes(startDatetype.toLowerCase())) dayCount-=0.5;
        if(['half day afternoon',"half day morning"].includes(endDatetype.toLowerCase())) dayCount-=0.5;

        return dayCount;
    }
    
    return -1;

}



function parseDate(dateStr) {
    const [day, month, year] = dateStr.replace(/[^0-9a-zA-Z]/g, '-').split('-');
    return new Date(`${year}-${month}-${day}`);
}

export { applyLeave, addLeaveType, cancelLeave, leaveAction, getLeaveDetails }