import mongoose from 'mongoose'

const cronSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // Ensures each job has a unique name
  },
  schedule: {
    type: String,
    required: true,  // Stores the cron expression (e.g., "0 0 * * *")
  },
  status: {
    type: String,
    enum: ["pending", "running", "completed", "failed"], // Track job status
    default: "pending",
  },
  lastRunAt: {
    type: Date, // Stores the last execution time
    default: null,
  },
  isActive : {
    type:Boolean,
    default:true
  }
},{timestamps:true});


const cronModel = mongoose.model('cronJob',cronSchema);

export default cronModel;