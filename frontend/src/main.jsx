import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store'
import BaseComponent from './BaseComponent.jsx'
import { fetchAllEmployees } from './slices/employeeSlice.js'




 
  
// console.dir(loggedData);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <BaseComponent></BaseComponent>
    </Provider>
  </StrictMode>,
)
