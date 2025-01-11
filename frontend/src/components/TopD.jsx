// import React, { useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { AppContext } from '../context/AppContext'

// const TopD = () => {
    
//     const navigate = useNavigate()
//     const { doctors } = useContext(AppContext)

//     return (
//         <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
//             <h1 className='text-3xl font-medium'>Top Salons to Book</h1>
//             <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted Barbars.</p>
//             <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
//                 {doctors.slice(0, 10).map((item, index) => (
//                     <div
//                         onClick={() => {
//                             navigate(`/appointment/${item._id}`);
//                             window.scrollTo(0, 0)
//                         }}
//                         className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
//                         key={index}
//                     >
//                         <img className='bg-blue-50' src={item.image} alt="" />
//                         <div className='p-4'>
//                             <div className='flex items-center gap-2 text-sm text-center text-green-500'>
//                                 <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
//                             </div>
//                             <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
//                             <p className='text-gray-600 text-sm'>{item.speciality}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <button onClick={() => { navigate('/saloons'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
//         </div>
//     )
// }

// export default TopD
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopSaloons = () => {
    const navigate = useNavigate()
    const { salons } = useContext(AppContext) // Access salons from the context
    const [filterAvailable, setFilterAvailable] = useState("all"); // Default filter to show all salons

    // Filter salons based on the selected availability filter
    const filteredSaloons = salons.filter(salon => {
        if (filterAvailable === "all") return true; // Show all salons
        if (filterAvailable === "available") return salon.available === true; // Show only available salons
        return salon.available === false; // Show only unavailable salons
    });

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Saloons to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted salons.</p>
            
            {/* Filter buttons */}
            <div className='mb-4'>
                <button
                    onClick={() => setFilterAvailable("all")}
                    className={`p-2 m-2 bg-blue-500 text-white rounded ${filterAvailable === "all" ? 'bg-blue-700' : ''}`}
                >
                    Show All
                </button>
                <button
                    onClick={() => setFilterAvailable("available")}
                    className={`p-2 m-2 bg-blue-500 text-white rounded ${filterAvailable === "available" ? 'bg-blue-700' : ''}`}
                >
                    Show Available
                </button>
                <button
                    onClick={() => setFilterAvailable("unavailable")}
                    className={`p-2 m-2 bg-blue-500 text-white rounded ${filterAvailable === "unavailable" ? 'bg-blue-700' : ''}`}
                >
                    Show Unavailable
                </button>
            </div>

            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {filteredSaloons.slice(0, 10).map((salon, index) => (
                    <div
                        onClick={() => {
                            navigate(`/appointment/${salon._id}`);
                            window.scrollTo(0, 0)
                        }}
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        key={index}
                    >
                        <img className='bg-blue-50' src={salon.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${salon.available ? 'text-green-500' : 'text-gray-500'}`}>
                                <p className={`w-2 h-2 rounded-full ${salon.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                                <p>{salon.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{salon.name}</p>
                            <p className='text-gray-600 text-sm'>{salon.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/saloons'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
        </div>
    )
}

export default TopSaloons
