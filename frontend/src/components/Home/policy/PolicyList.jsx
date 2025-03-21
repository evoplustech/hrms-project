import React from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook'
import PolicyLineItem from './PolicyLineItem';


const PolicyList = () => {
    const { error, data, status } = useSelectorHook('policy');

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl bg-slate-200 rounded-lg p-4 font-semibold text-gray-800 mb-6">PolicyList</h1>
            <div>
                {   data?.length > 0 ? (data.map((policy, index) => (
                        <PolicyLineItem policy={policy} key={index} />
                    )))
                    :
                    <div>
                        <p className='text-5xl text-center border p-4'>No Record Found</p>
                    </div>
                }
            </div>
        </div>
    );
};



export default PolicyList