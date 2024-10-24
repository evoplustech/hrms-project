import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  
  holidayName: {
    type: String,
    required: true,
    trim: true
  },
  holidayDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  holidayType: {
    type: String,
    enum: ['Public', 'Company', 'Custom'],
    default: 'Public'
  },
  isRecurring: {
    type: Boolean,
    default: false  // Set to true if the holiday repeats every year
  },
  isActive: {
    type: Boolean,
    default: true  // Logical deletion, set to false to deactivate
  }
},{timestamps:true});


const holidayModel = mongoose.model('Holiday',holidaySchema);