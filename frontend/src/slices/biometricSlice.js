import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import httpRequest from "../../utils/httpRequest";

// Fetch biometric devices
export const fetchBiometricDevice = createAsyncThunk('/fetchbiometric', async () => {
  try {
    const response = await httpRequest({ path: '/api/biometric/getbiometricdevice', method: 'get' });
    return response;  // Return data if success
  } catch (error) {
    console.error('Error:', error.message);
    throw error;  // Throw error for rejection
  }
});

// Add biometric device
export const addBiometricDevice = createAsyncThunk('/adddevice', async (deviceData) => {
  try {
    console.log(deviceData);  // Debug: Log the deviceData
    const response = await httpRequest({ path: '/api/biometric/addbiometricdevice', method: 'post', data: deviceData });
    return response;  // Return response
  } catch (error) {
    console.error('Error:', error.message);
    throw error;  // Throw error for rejection
  }
});

// Initial state
const initialState = {
  data: [],
  status: "idle", // Default state for request status
  error: null
};

const biometricSlice = createSlice({
  name: "biometricSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchBiometricDevice
    builder
      .addCase(fetchBiometricDevice.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchBiometricDevice.fulfilled, (state, action) => {
        state.status = 'success';
        if (action.payload.success) {
          state.data = action.payload.data;  // Set data from API response
          state.error = null;
        } else {
          state.data = [];
          state.error = action.payload.error;
        }
      })
      .addCase(fetchBiometricDevice.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;  // Set error message if rejected
      })

      // Handle addBiometricDevice
      .addCase(addBiometricDevice.pending, (state) => {
        state.status = 'loading';  // Set status to loading
      })
      .addCase(addBiometricDevice.fulfilled, (state, action) => {
        state.status = 'success';

        if (action.payload.success) {
          const newDevice = action.payload.data;
          
          // Check if this is an update or add
          const existingDeviceIndex = state.data.findIndex(device => device._id === newDevice._id);
            console.log(existingDeviceIndex)
          if (existingDeviceIndex >= 0) {
            // Update existing device
            state.data = state.data.map(device => 
              device._id === newDevice._id ? newDevice : device
            );
          } else {
            // Add new device
            state.data.push(newDevice);
          }

          state.error = null;
        } else {
          state.data = [];
          state.error = action.payload.error;
        }
      })
      .addCase(addBiometricDevice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;  // Handle error from rejected state
      });
  }
});

// Selector for biometric details
export const biometricDetails = (state) => state.biometricSlice.data;

export default biometricSlice.reducer;
