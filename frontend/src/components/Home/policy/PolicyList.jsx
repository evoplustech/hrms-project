import React from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook'
import PolicyLineItem from './PolicyLineItem';


const PolicyList = () => {
    const { error, data, status } = useSelectorHook('policy');

    return (
        <div className="">
            {/* <h1 className="text-xl font-semibold text-gray-800 mb-6">PolicyList</h1> */}
            <div>
                {   data?.length > 0 ? (data.map((policy, index) => (
                        <PolicyLineItem policy={policy} key={index} />
                    )))
                    :
                    <div>
                        <p className='text-xl text-center border p-4'>No Record Found</p>
                    </div>
                }
            </div>
        </div>
    );
};



export default PolicyList