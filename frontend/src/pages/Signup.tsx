import React from 'react'
import Quote from '../Components/Quote'
import Auth from '../Components/Auth'


const Signup = () => {
    return (
        <div>
            <div className='grid grid-cols-2'>
                <div>
                <Auth/>
                </div>
                <div className='invisible lg:visible'>
                    <Quote />
                </div>
            </div>

        </div>
    )
}

export default Signup
