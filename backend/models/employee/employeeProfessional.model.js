import mongoose from "mongoose";

const employeeProfessionalSchema = new mongoose.Schema({
  empPersonalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee_personal_detail', // Reference to the Employee collection
    required: true
  },
employeeId: {
  type: String,
  required: true,
  unique: true // Unique Employee ID
},
department: { type: String, required: true },
designation: { type: String, required: true },

// department: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'OrgUnit', // Reference to the Department (combined schema)
//   required: true // Dropdown selection for department
// },
// designation: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'OrgUnit', // Reference to the Designation (combined schema)
//   required: true // Dropdown selection for designation
// },
dateOfJoining: { type: Date, required: true },
employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract'], required: true },
salary: {
  basic: Number,
  hra: Number,
  allowances: Number,
  total: Number
},
workLocation: {
  office: String,
  city: String
},
reportingManager: {
  managerId: { type: String },
  managerName: { type: String }
},
experience: [
  {
    company: String,
    position: String,
    fromDate: Date,
    toDate: Date
  }
],
skills: [String],
status: { type: String, enum: ['Active', 'Inactive', 'Resigned'], default: 'Active' },

// User Authentication Details
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/.+\@.+\..+/, 'Please enter a valid email address']
},
password: { type: String, required: true, minlength: 6 },
role: { type: String, enum: ['admin', 'employee', 'hr','manager','tl'], default: 'employee' },

 // Leave Balance Tracking
leaveBalances: {
  sickLeave: { type: Number, max:8, default: 0 }, // Default balance
  casualLeave: { type: Number, max:12, default: 0 },
  paidLeave: { type: Number,  max:2, default: 0 },
  unpaidLeave: { type: Number,  default: 0 }, // Unpaid leave doesn't affect balance
  compensatoryOff: { type: Number, default: 0 }
},

shift: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Shift',  // Reference to the Shift collection
  required: true  // Each employee must have an assigned shift
},

conformation: {
  type: Boolean,
  default: false // Optional: set a default value for conformation
},

// Biometric userID for integration 
userId: { type: String, unique: true },

isActive: { type: Boolean, default: true }, // Logical delete flag

}, { timestamps: true });


const employeeProfessionalModel = mongoose.model('Employee_professional_detail',employeeProfessionalSchema);

export default employeeProfessionalModel;