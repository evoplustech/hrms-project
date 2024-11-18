
import leaveModel from "../../models/attendance/leave.model.js";
import employeeProfessionalModel from "../../models/employee/EmployeeProfessional.model.js";

const applyLeave = async (req, res) => {
    // Extract data from the request body
    const { employee, leaveType, startDate, endDate, reason, status, approvedBy, approvedOn, isActive } = req.body;


    // Check if the employee exists in the database (Fetch leave balance)
    const empDetail = await employeeProfessionalModel.find({ _id: employee });

    // If employee doesn't exist or leave balance is not available, handle the error
    if (!empDetail || empDetail.length === 0) {
        return res.status(404).json({ success: false, error: "Employee not found." });
    }

    // Log the available leave balance for the requested leave type
    const avalLeave = empDetail[0]['leaveBalances'][leaveType] ? empDetail[0]['leaveBalances'][leaveType]:false;
    
    avalLeave?console.log(avalLeave):console.log("false statement")

    // Calculate days count between start and end date after parsing
    const start = parseDate(startDate);  // Parse start date
    const end = parseDate(endDate);      // Parse end date

    // Use compareDates function to get the difference in days
    const daysCount = compareDates(start, end);

    // Check if start date is later than end date or if the days count is invalid
    if (start > end || daysCount === -1) {
        return res.status(400).json({
            success: false,
            error: "Start date must be less than end date."
        });
    }

    // Prepare the leave application data
    const newLeaveApply = leaveModel({
        employee,
        leaveType,
        startDate: start,
        endDate: end,
        daysCount,
        reason,
        status: status || "Pending", // Set default status if not provided
        appliedOn: new Date(), // Applied on the current date
        approvedBy,
        approvedOn,
        isActive
    });

    try {
        // Save the new leave application
        // await newLeaveApply.save();
        return res.status(200).json( { success: true, leaveId: newLeaveApply._id } );
    } catch (error) {
        // If an error occurs during save, handle it
        console.error("Error applying leave:", error.message);
        return res.status(500).json({ success: false, error: "Failed to apply leave. Please try again later." });
    }
};


function compareDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize to just the date (remove time part)
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start.getTime() === end.getTime()) return 1;  // Dates are the same
    if (end.getTime() > start.getTime()) {
      const diffDays = (end - start) / (1000 * 3600 * 24);
      return diffDays === 1 ? 2 : diffDays+1;  // 1 day difference or more
    }
    return -1;  // End date is before start date
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.replace(/[^0-9a-zA-Z]/g, '-').split('-');
    return new Date(`${year}-${month}-${day}`);
}

export { applyLeave }