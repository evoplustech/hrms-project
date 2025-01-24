
import leaveModel from "../../models/attendance/leave.model.js";
import leaveTypeModel from "../../models/attendance/leaveType.model.js";
import employeeProfessionalModel from "../../models/employee/EmployeeProfessional.model.js";


const getLeaveDetails = async (req,res)=>{
    try {

        let { role, empId } = req;
        role = 'admin';
        let {status, AppliedStartDate, AppliedEndDate, mine } = req.body;
        const  query = {};

        if( (AppliedStartDate ==='' && AppliedEndDate !=='') || (AppliedStartDate !=='' && AppliedEndDate ==='') ) return res.status(400).json({ success:false, error: "Need Both dates to search Applied Leaves." })

        if( AppliedStartDate === '' && AppliedEndDate === '' ){

            const currentYear = new Date().getFullYear();
            AppliedStartDate = new Date(`${currentYear}-01-01`);
            AppliedEndDate = new Date(`${currentYear}-12-31`);

        }else if(AppliedStartDate !== '' && AppliedEndDate !== ''){
            query.startDate = { $gte: new Date(AppliedStartDate), $lte: new Date(AppliedEndDate) }
            query.endDate = { $gte: new Date(AppliedStartDate), $lte: new Date(AppliedEndDate) }
        }

        if(status !== '') query.status = status

        if(mine === 'mine') query.employeeId = empId;

        if( role.toLowerCase() === 'employee' ){
            if(mine === 'all') return res.status(400).json({ success:true , error: "Unauthorise to fetch others details"})

        }else if(role.toLowerCase() === 'manager' || role.toLowerCase() === 'tl'){

            if(mine === 'all'){
                const employeeIdList = await reportingEmployeeIds(empId);
                query.employeeId = { $in: employeeIdList };
                if(query.status === '') query.status = { $nin : ['Cancelled'] }
            }
            // const leaveDetails = await leaveModel.find(query);
        }
        // else if(role.toLowerCase() === 'admin' || role.toLowerCase() === 'hr'){
        //     if(mine === 'all'){
            
        //     }
        // }
        // return res.status(200).json({query})
        // console.log(query)

        const leaveDetails = await leaveModel.find(query).populate([
            { 
                path:'employeeId',
                select: '',
                // populate: { path:'role', select:'' }
                populate: [
                    { path:'empPersonalId', select:'' },
                    { path:'role', select:'' }
                ]
            },
            { path:'leaveTypeId', select:'' },
            {
                path:'approvedBy',
                select:'',
                populate: { path:'empPersonalId', select:'' }
            }
        ])
        const leaveDetails_Data = leaveDetails.map((leave) => {
            // console.log(leave.employeeId.empPersonalId.firstName);
            const leave_dtails = {
                leaveId: leave._id,
                name: (`${leave.employeeId.empPersonalId.firstName} ${leave.employeeId.empPersonalId.lastName}`),
                leaveType: leave.leaveTypeId.leaveType,
                startDate: leave.startDate,
                startDatetype: leave.startDatetype,
                endDate: leave.endDate,
                endDatetype: leave.endDatetype,
                numberofDays: leave.daysCount,
                leaveReason: leave.reason,
                leaveStatus: leave.status,
                approvedBy: leave.approvedBy?.empPersonalId.firstName

            }
            return leave_dtails;
        } );
        // console.log(leaveDetails_Data.length)
        if(leaveDetails_Data.length){
            return res.status(200).json({ success:true, data: leaveDetails_Data })
        }else{
            return res.status(200).json({ success:true, data: "No Leave Record Found" })
        }


    } catch (error) {
        console.log("Error in get Leave Details function in leave controller ::" + error.message)
        return res.status(409).json({ success: false, message: "Internal Server Error"})
    }
}

async function reportingEmployeeIds(empId) {

    let employeeIds = []; // Store all employee IDs

    // Fetch direct reports of the given manager (empId)
    const employeeDetails = await employeeProfessionalModel.find({ managerId: empId }).select('_id');
    
    // Extract and store the direct report IDs
    const directReportIds = employeeDetails.map(emp => emp._id);
    employeeIds.push(...directReportIds);

    // Recursively fetch employees of each direct report
    for (const id of directReportIds) {
        const subEmployeeIds = await reportingEmployeeIds(id); // Recursive call
        employeeIds.push(...subEmployeeIds);
    }

    return employeeIds;
}


const applyLeave = async (req, res) => {

    try {
        const { employeeId, leaveTypeId, startDate, startDatetype, endDate, endDatetype, reason, status = "Pending", approvedBy, approvedOn, isActive } = req.body;

        const start     = parseDate(startDate);
        const end       = parseDate(endDate);
        let daysCount   = compareDates(start, end, startDatetype, endDatetype);

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
            // startDate: { $lte: new Date(end), $gte: new Date(start) },
            // endDate: { $lte: new Date(end), $gte: new Date(start) },
            $or: [
                { startDate: { $lte: new Date(end), $gte: new Date(start) } },
                { endDate: { $lte: new Date(end), $gte: new Date(start) } }
            ],
            status: { $in: ['Approved', 'Pending'] }
        });
        // return res.status(200).json({appliedLeave,start,end});
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
        // console.log(diffInDays)
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

        if(!['pending','cancelled','rejected','approved'].includes(action.toLowerCase())) return res.status(409).json({success:false, message: "Invalid Action." })

        // Find leave details
        const leaveDetails = await leaveModel.findById(leaveId);
        if (!leaveDetails) {
            return res.status(400).json({ success: false, message: "Leave record not found." });
        }

        // Prevent duplicate actions
        if ((leaveDetails.status).toLowerCase() === action.toLowerCase()) {
            return res.status(400).json({ success: false, message: `This leave request has already been ${action}.` });
        }

        if(leaveDetails.status.toLowerCase() === 'pending' && action.toLowerCase() === 'cancelled'){
            const leaveExist = await leaveModel.findOneAndUpdate(
                { _id: leaveId, status: "Pending" },  // Query
                { $set: { status: "Cancelled" } },    // Update operation
                { new: true }                         // Return the updated document
            );
            if (!leaveExist) {
                return res.status(400).json({ success: false, message: "The leave request could not be found." });
            }
            return res.status(200).json({ success: true, message: "Your leave has been cancelled successfully." });
        }

        // Check role authorization
        if (!['hr', 'admin', 'manager', 'tl'].includes(role.toLowerCase()) || leaveDetails.employeeId.toString() === empId ) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to approve your own leave request."
            });
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