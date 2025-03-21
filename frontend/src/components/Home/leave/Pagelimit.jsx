import React from 'react'

const Pagelimit = ({searchParams,handlePageLimit}) => {

  return (<>
    <label>Page Limit:</label>
    <select value={searchParams.limit} name='limit' className='bg-white border-none mx-2 p-1' onChange={(e)=>handlePageLimit(e)}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
    </select>
  </>)
}

export default Pagelimit