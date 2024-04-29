import React from 'react'

const Quote = () => {
    return (
        <div className='bg-slate-200 h-screen flex justify-center flex-col'>
            <div className='flex justify-center'>
                <div className='max-w-lg '>
                    <div className='text-2xl font-bold'>
                        "The Customer Service I received was exceptional. The Support team went above and beyond to address my concerns."
                    </div>
                    <div className='max-w-md text-xl font-semibold mt-4'>
                        Julies winfield
                    </div>
                    <div className='max-w-md text-sm font-semibold text-slate-400'>
                        CEO Acme Inc
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quote
