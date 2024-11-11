
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Home'

function App() {
 

  return (
    <>
    <div className="container">
      <h1>This is App Component</h1>
        <Outlet></Outlet>
    </div>
    </>
  )
}

export default App
