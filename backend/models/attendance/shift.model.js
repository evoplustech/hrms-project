import mongoose from "mongoose";


const ShiftSchema = new Schema({
  shiftName: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: String,
    required: true // Store time as string (e.g., '09:00 AM')
  },
  endTime: {
    type: String,
    required: true // Store time as string (e.g., '05:00 PM')
  },
  days: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true  // Array of days the shift applies to
  },
  isActive: {
    type: Boolean,
    default: true  // Logical deletion, set to false to deactivate
  }
}, { timestamps: true });  // Automatically adds `createdAt` and `updatedAt`

module.exports = mongoose.model('Shift', ShiftSchema);