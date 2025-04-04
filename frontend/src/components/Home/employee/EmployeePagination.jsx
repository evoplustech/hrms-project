import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { paginationNo } from '../../../../utils/paginationNo';


const EmployeePagination = ({searchFilter,setsearchFilter,fetchEmployees,totalPages}) => {

const {limit,page} = searchFilter;
const {prev, next} = paginationNo(page,totalPages);

const setterHandlers =  ({name,value})=>{
  let updatedQuery = {[name]:value}
  if(name==='limit')
    updatedQuery = {[name]:value,page:1} 
  setsearchFilter({...searchFilter,...updatedQuery});
  fetchEmployees({name,value});
}
  return (
    <>
    <div className="flex justify-between mt-10">
      <div>
        <label>Per-Page : </label>
        <select value={limit} name="limit" onChange={(e)=>{setterHandlers(e.target)}} className="px-4 py-2">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
        </select>
      </div>
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-10 text-base">
          {
            (+page===1 && totalPages===0) ? ( <><li  disabled="disabled">
            <button disabled="disabled"   className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white  cursor-not-allowed`}>
              <span className="sr-only">Previous</span>
              <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
              </svg>
            </button>
          </li>
           <li>
           <button disabled="disabled" className={`flex items-center  justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-not-allowed`}>
             <span className="sr-only">Next</span>
             <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
             </svg>
           </button>
           </li>
           </>  
        ) : (
        <>
        {
          +page > 1 &&
          <li>
              <button value={+page - 1} name="page" onClick={(e)=>{setterHandlers(e.currentTarget)}} className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                <GrFormPrevious />
              </button>
            </li>
            }
           { totalPages > 0 && Array(totalPages).fill(0).map((value,key)=>{
                const pageNo = key + 1;
               
                if(pageNo >= prev && pageNo <= next){
                  console.log('Type of page:', typeof page, 'Type of pageNo:', typeof pageNo);                  
                  const pageNumber = Number(page);
                  return (
                    <li key={key}>
                     <button value={pageNo} name="page" onClick={(e)=>{setterHandlers(e.target)}} className={`flex items-center justify-center ${ +page === pageNo ? 'bg-teal-400 font-semibold':''}  px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{pageNo}</button>
                    </li>
                  )
                }
              })
           }
          {
          totalPages !== +page &&
          <li>
          <button  value={+page + 1} name="page" onClick={(e)=>{setterHandlers(e.currentTarget)}} className={`flex items-center  justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
              <MdNavigateNext />
          </button>
          </li>
          }
        </>)
          }
        </ul>
      </nav>
    </div>
    </>
  )
};

export default EmployeePagination