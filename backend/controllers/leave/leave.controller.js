
import leaveModel from "../../models/attendance/leave.model.js";
import leaveTypeModel from "../../models/attendance/leaveType.model.js";
import employeeProfessionalModel from "../../models/employee/EmployeeProfessional.model.js";

const applyLeave = async (req, res) => {
    const { employeeId, leaveTypeId, startDate, startDatetype, endDate, endDatetype, reason, status = "Pending", approvedBy, approvedOn, isActive } = req.body;

    try {
        // Parse dates and calculate days count
        const start     = parseDate(startDate);
        const end       = parseDate(endDate);
        const daysCount = compareDates(start, end, startDatetype, endDatetype);
        // const cancelOrRejectStatuses = ["Cancelled", "Rejected"];

        if (start.getDay() > end.getDay()) {
            return res.status(400).json({
                error: 'Leave from Friday to Monday is not allowed. Please choose different dates.'
            });
        }

        const appliedLeave = await leaveModel.find({
            employeeId,
            startDate: { $lte: new Date(end), $gte: new Date(start) },
            endDate: {  $lte: new Date(end), $gte: new Date(start) },
            status: { $in: ['Approved', 'Pending'] }
        });

        if (appliedLeave.length !==0 ) {

            return res.status(409).json({
                success: false,
                error: "Leave cannot be applied because a previous leave is still in a pending or approved state."
            });

        }

        if(typeof(daysCount) === 'string'){
            return res.status(400).json({ success: false, error: daysCount });
        }
        // Check if dates are valid
        if (start > end || daysCount === -1) {
            return res.status(400).json({ success: false, error: "Start date must be less than end date." });
        }

        // Fetch employee details and leave type information
        const [empDetail] = await employeeProfessionalModel.find({ _id: employeeId, isActive: true });
        if (!empDetail) return res.status(404).json({ success: false, error: "Employee not found." });

        const { leaveBalances } = empDetail;
        const leaveType = (await leaveTypeModel.findOne({ _id: leaveTypeId })).leaveType;
        const availableLeave = leaveBalances[leaveType] || 0;

        if(['sickLeave', 'casualLeave'].includes(leaveType)){
            // Validate leave availability
            if (availableLeave <= 0 || daysCount > availableLeave) {
                return res.status(400).json({
                    success: false,
                    error: `Your ${leaveType} balance is insufficient. Available: ${availableLeave}, Requested: ${daysCount}.`
                });
            }
        }

        // Create and save the leave application
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
        // const { role } = req;
        const  role = 'hr';
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

        const { employeeId, daysCount, leaveTypeId, status } = leaveDetails;

        // Fetch employee and leave type in parallel
        const [empDetail, leaveType] = await Promise.all([
            employeeProfessionalModel.findOne({ _id: employeeId, isActive: true }),
            leaveTypeModel.findById(leaveTypeId)
        ]);

        if (!empDetail || !leaveType) {
            return res.status(404).json({ success: false, message: "Employee or Leave type not found." });
        }

        // Adjust leave balance based on action
        const availableLeave = empDetail.leaveBalances[leaveType.leaveType] || 0;
        let leaveAdjustment=null;

        if (['approved', 'rejected', 'cancelled'].includes(action.toLowerCase())) {
            leaveAdjustment = ['sickLeave', 'casualLeave'].includes(leaveType.leaveType)
                ? (action.toLowerCase() === 'approved' ? availableLeave - daysCount : availableLeave + daysCount)
                : (action.toLowerCase() === 'approved' ? availableLeave + daysCount : availableLeave - daysCount);
        }

        // Update leave balance if needed
        if ((status.toLowerCase() === 'pending' && action.toLowerCase() === 'approved') || 
            (status.toLowerCase() === 'approved' && action.toLowerCase() !== 'approved')) {
            await employeeProfessionalModel.findByIdAndUpdate(employeeId, {
                $set: { [`leaveBalances.${leaveType.name}`]: leaveAdjustment }
            });
        }

        // Update leave request status
        await leaveModel.findByIdAndUpdate(leaveId, { $set: { status: action } });

        return res.status(200).json({ success: true, message: "Leave status updated successfully." });
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
            { _id: leaveId, status: "Pending" }, // Query
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
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize the start and end dates by setting the time to 00:00:00
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Ensure both start and end are Date objects before proceeding
    if (!(start instanceof Date) || !(end instanceof Date)) {
        return ("Invalid date input");
    }

    if (start === end && startDatetype === endDatetype) {
        return ['Half Day Morning', 'Half Day Afternoon'].includes(startDatetype) ? 0.5 : 1;
    }

    if (end > start) {
        // Calculate the difference in days (+1 for inclusive count)
        let diffDays = (end - start) / (1000 * 3600 * 24) + 1;  

        if(startDatetype === 'Half Day Afternoon' && endDatetype === "Half Day Morning"){
            return 1;
        }

        if( Number(diffDays) >= 2 ){
            // Check for valid combinations:
            const invalidCombinations = [
                ["Full Day", "Half Day Afternoon"],
                ["Half Day Morning", "Full Day"],
                ["Half Day Morning", "Half Day Afternoon"],
                ["Half Day Afternoon", "Half Day Afternoon"]
            ];
            
            // Check if the combination exists in the invalidCombinations array
            if (invalidCombinations.some(([startType, endType]) => startDatetype === startType && endDatetype === endType)) {
                return "This combination can't be applied.";  // Invalid combination
            }

            if ((startDatetype === "Full Day" && endDatetype === "Half Day Morning") || (startDatetype === "Half Day Afternoon" && endDatetype === "Full Day")) {
                return 1.5;  // Full Day + Half Day Morning = 1.5 days
            }

            if ((startDatetype === "Half Day Morning" && endDatetype === "Half Day Afternoon")) {
                return "This combination can't be applied.";  // Invalid combination
            }

            // Subtract half day for both start and end dates if applicable
            if (['Half Day Morning', 'Half Day Afternoon'].includes(startDatetype)) diffDays -= 0.5;
            if (['Half Day Morning', 'Half Day Afternoon'].includes(endDatetype)) diffDays -= 0.5;
            return diffDays;
        }


    }

    return -1;  // End date is before start date
}


function parseDate(dateStr) {
    const [day, month, year] = dateStr.replace(/[^0-9a-zA-Z]/g, '-').split('-');
    return new Date(`${year}-${month}-${day}`);
}

export { applyLeave, addLeaveType, cancelLeave, leaveAction }