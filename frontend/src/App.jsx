
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Home'

function App() {
 

  return (
    <>

    <Routes>
        <Route path="/" element={<Home />} >

        </Route>
    </Routes>
      <h1 className="text-3xl font-bold underline">
       Hello world!
      </h1>
    
    </>
  )
}

export default App
