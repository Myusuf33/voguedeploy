// import React from 'react'
// import { useContext, useEffect } from 'react'
// import { DContext } from '../../context/DContext'
// import { AppContext } from '../../context/AppContext'
// import { assets } from '../../assets/assets'

// const DAppointments = () => {

//   const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DContext)
//   const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

//   useEffect(() => {
//     if (dToken) {
//       getAppointments()
//     }
//   }, [dToken])

//   return (
//     <div className='w-full max-w-6xl m-5 '>

//       <p className='mb-3 text-lg font-medium'>All Appointments</p>

//       <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
//         <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
//           <p>#</p>
//           <p>Salon</p>
//           <p>Payment</p>
//           <p>___</p>
//           <p>Date & Time</p>
//           <p>Fees</p>
//           <p>Action</p>
//         </div>
//         {appointments.map((item, index) => (
//           <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
//             <p className='max-sm:hidden'>{index}</p>
//             <div className='flex items-center gap-2'>
//               <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
//             </div>
//             <div>
//               <p className='text-xs inline border border-primary px-2 rounded-full'>
//                 {item.payment?'Online':'CASH'}
//               </p>
//             </div>
//             <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
//             <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
//             <p>{currency}{item.amount}</p>
//             {item.cancelled
//               ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
//               : item.isCompleted
//                 ? <p className='text-green-500 text-xs font-medium'>Completed</p>
//                 : <div className='flex'>
//                   <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
//                   <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
//                 </div>
//             }
//           </div>
//         ))}
//       </div>

//     </div>
//   )
// }

// export default DAppointments
import React, { useContext, useEffect, useState } from 'react';
import { DContext } from '../../context/DContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [workerFees, setWorkerFees] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  useEffect(() => {
    // Filter appointments based on the selected filter
    let updatedAppointments = appointments;
    if (filter === 'Completed') {
      updatedAppointments = appointments.filter((item) => item.isCompleted);
    } else if (filter === 'Cancelled') {
      updatedAppointments = appointments.filter((item) => item.cancelled);
    } else if (filter === 'Pending') {
      updatedAppointments = appointments.filter((item) => !item.isCompleted && !item.cancelled);
    }
    setFilteredAppointments(updatedAppointments);

    // Calculate total fees for each worker
    const fees = {};
    let shopIncome = 0;
    appointments.forEach((item) => {
      const worker = item.userData.name;
      if (!fees[worker]) fees[worker] = 0;
      fees[worker] += item.amount;

      // Add income if the appointment is completed
      if (item.isCompleted) {
        shopIncome += item.amount;
      }
    });
    setWorkerFees(fees);
    setTotalIncome(shopIncome);
  }, [appointments, filter]);

  const handleCompleteAppointment = (appointmentId, workerName, amount) => {
    completeAppointment(appointmentId);
    setWorkerFees((prevFees) => ({
      ...prevFees,
      [workerName]: (prevFees[workerName] || 0) + amount, // Add the amount to the worker's total fee
    }));
    setTotalIncome((prevIncome) => prevIncome + amount); // Add the completed appointment fee to the total income
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-5 p-5 bg-gray-100 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <p className="text-xl font-semibold">All Appointments</p>
        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm font-medium">
            Filter by Status:
          </label>
          <select
            id="filter"
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Fees Summary */}
      <div className="bg-white p-4 rounded mb-5">
        <p className="text-lg font-medium mb-3">Worker Fees Summary</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(workerFees).map((worker, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded shadow">
              <p>{worker}</p>
              <p className="font-semibold">{currency}{workerFees[worker]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total Income */}
      <div className="bg-white p-4 rounded mb-5">
        <p className="text-lg font-medium mb-3">Total Shop Income</p>
        <p className="font-semibold">{currency}{totalIncome}</p>
      </div>

      {/* Appointments Table */}
      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Salon</p>
          <p>Payment</p>
          <p>__</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {filteredAppointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="hidden sm:block">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img src={item.userData.image} className="w-8 h-8 rounded-full" alt="" />
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className={`text-xs inline border px-2 rounded-full ${item.payment ? 'border-green-500' : 'border-red-500'}`}>
                {item.payment ? 'Online' : 'CASH'}
              </p>
            </div>
{/*             <p className="hidden sm:block">{calculateAge(item.userData.dob)}</p> */}
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 cursor-pointer"
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
                <img
                  onClick={() => handleCompleteAppointment(item._id, item.userData.name, item.amount)}
                  className="w-8 cursor-pointer"
                  src={assets.tick_icon}
                  alt="Complete"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DAppointments;
