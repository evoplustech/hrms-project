import React from 'react'

const LeaveSearch = ({ userRole, setSearchParams, searchParams, handleSubmit}) => {

    const handleChange = (e) => {
        const {name,value} = e.target
        setSearchParams({...searchParams,[name]:value})
    }
    return (<>
        <form onSubmit={(e)=> e.preventDefault()}>
            <div className='flex flex- my-4 justify-center items-center'>
                <div>
                    <label>Status</label>
                    {/* <input name='status' type='text' className='border p-2 m-2'  onChange={handleChange} value={searchParams.status} /> */}
                    <select name='status'  className='border p-2 m-2 bg-white'  onChange={handleChange}  value = {searchParams?.status}>
                        <option value="">Select</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div>
                    <label>Start Date</label>
                    <input name='AppliedStartDate' type='date' className='border p-2 m-2' value={searchParams?.AppliedStartDate} onChange={handleChange} />
                </div>
                <div>
                    <label>End Date</label>
                    <input name='AppliedEndDate' type='date' className='border p-2 m-2' value={searchParams?.AppliedEndDate} onChange={handleChange} />
                </div>
                {['admin','hr','tl','manager'].includes(userRole.toLowerCase()) && <div> 
                    <select name='mine' className='border p-2 m-2 bg-white' onChange={handleChange} value={searchParams?.mine} >
                        <option value="">Select</option>
                        <option value="Mine">Mine</option>
                        <option value="Others">Others</option>
                    </select>
                </div>}
                <div>
                    <input type='submit' name='search' value="Search" className='text-lg px-3 py-1 border border-gray-500 rounded-xl text-center tracking-wider bg-green-500 cursor-pointer hover:bg-green-300'  onClick={handleSubmit}/>
                </div>
            </div>
        </form>
    </>)
};

export default LeaveSearch