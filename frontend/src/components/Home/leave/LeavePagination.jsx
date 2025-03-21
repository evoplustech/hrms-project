import React, { useEffect } from 'react'

const LeavePagination = ({ searchParams, limit, page, totalRecord, prevPage, nextPage }) => {
    console.log("Pagination")
    let lastPage = Math.round(totalRecord/limit)
    if(totalRecord > (limit*lastPage)){
        lastPage+=1;
    }


    if(Number(page) === 0){
        return (<><button 
            disabled={true}
            className={`px-4 py-2 bg-green-500 text-white rounded-md opacity-50 cursor-not-allowed 'hover:bg-green-500'`} >
            Prev
        </button><button 
        disabled={true}
        className={`px-4 py-2 bg-green-500 text-white rounded-md opacity-50 cursor-not-allowed 'hover:bg-green-500'`} >
        Next
    </button></>)
    }

    return (<>
    <button 
        onClick={(e)=>prevPage(Number(page)-1)} 
        disabled={Number(page) === 1}
        className={`px-4 py-2 bg-green-500 text-white rounded-md ${Number(page) === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'}`}
    >
        Prev
    </button>


    {Number(page) > Number(1) && <button 
        onClick={(e)=>prevPage(Number(page)-1)} 
        className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400`}
    >
        {Number(page)-1}
    </button>}
    {/* curren page start */}
    <button 
        disabled={Number(page) === Number(searchParams.page)}
        className={`px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-500`}
    >
        {Number(page)}
    </button>
    {/* curren page end */}

    {Number(page) < Number(lastPage) && <button 
        onClick={(e)=>nextPage(Number(page)+1)} 
        className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400`}
    >
        {Number(page)+1}
    </button>}



    <button 
        onClick={(e)=>nextPage(page+1)} 
        disabled={Number(page) === Number(lastPage)}
        className={`px-4 py-2 bg-green-500 text-white rounded-md 
            ${Number(page) === Number(lastPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'}`}
    >
        Next
    </button>
    </>)
}

export default LeavePagination