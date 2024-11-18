import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import BaseComponent from './BaseComponent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <BaseComponent></BaseComponent>
    </Provider>
  </StrictMode>,
)
