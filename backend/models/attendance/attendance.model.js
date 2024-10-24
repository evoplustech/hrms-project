import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee_professional_detail', // Reference to the Employee collection
      required: true
    },
    date: {
      type: Date,
      required: true,
      index: true // Index for faster querying
    },
    checkInTime: {
      type: Date,
      required: true
    },
    checkOutTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave', 'Half-Day'], // Attendance status
      default: 'Present'
    },
    totalHours: {
      type: Number, // Total hours worked
      default: 0
    },
    Late :{
      type:String,
      
    },
    remarks: {
      type: String, // Optional field for any remarks (e.g., reason for absence)
      trim: true
    },
   
    isActive: { type: Boolean, default: true } // Logical delete flag
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now
    // }
  }, { timestamps: true }
);

const attendanceModel = mongoose.model('Attendance',attendanceSchema);

export default attendanceModel;