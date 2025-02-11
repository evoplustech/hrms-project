import React from 'react'
import Header from '../layouts/Header'
import Sidebar from '../layouts/Sidebar'
import Footer from '../layouts/Footer'
import Catogary from '../layouts/Catogary'
import { Outlet } from 'react-router-dom'
import useActiveTab from '../../hooks/useActiveTab'

const Home = () => {
  const [tab,subCatagory] = useActiveTab();

  console.log(useActiveTab());
  console.log(tab)
  return (
    <>
      <div className="">
        <div className="flex flex-row ">
          <Header/>
          <Catogary subCatagory = {subCatagory}/>
          <Sidebar tab = {tab}/>
          <Outlet></Outlet>
        </div>
        <Footer/>
      </div>
    </>

  )
}

export default Home