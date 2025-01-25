// // import React, { useEffect } from 'react'
// // import { assets } from '../../assets/assets'
// // import { useContext } from 'react'
// // import { AdminContext } from '../../context/AdminContext'
// // import { AppContext } from '../../context/AppContext'

// // const AllAppointments = () => {

// //   const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
// //   const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

// //   useEffect(() => {
// //     if (aToken) {
// //       getAllAppointments()
// //     }
// //   }, [aToken])

// //   return (
// //     <div className='w-full max-w-6xl m-5 '>

// //       <p className='mb-3 text-lg font-medium'>All Appointments</p>

// //       <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
// //         <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
// //           <p>#</p>
// //           <p>User</p>
// //           <p>....</p>
// //           <p>Date & Time</p>
// //           <p>Salon</p>
// //           <p>Fees</p>
// //           <p>Action</p>
// //         </div>
// //         {appointments.map((item, index) => (
// //           <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
// //             <p className='max-sm:hidden'>{index+1}</p>
// //             <div className='flex items-center gap-2'>
// //               <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
// //             </div>
// //             <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
// //             <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
// //             <div className='flex items-center gap-2'>
// //               <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt="" /> <p>{item.docData.name}</p>
// //             </div>
// //             <p>{currency}{item.amount}</p>
// //             {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
// //           </div>
// //         ))}
// //       </div>

// //     </div>
// //   )
// // }

// // export default AllAppointments


// import React, { useEffect } from 'react'
// import { assets } from '../../assets/assets'
// import { useContext } from 'react'
// import { AdminContext } from '../../context/AdminContext'
// import { AppContext } from '../../context/AppContext'

// const AllAppointments = () => {

//   const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
//   const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

//   useEffect(() => {
//     if (aToken) {
//       getAllAppointments()
//     }
//   }, [aToken])

//   return (
//     <div className='w-full max-w-6xl m-5 '>

//       <p className='mb-3 text-lg font-medium'>All Appointments</p>

//       <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
//         <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
//           <p>#</p>
//           <p>User</p>
//           <p>....</p>
//           <p>Date & Time</p>
//           <p>Salon</p>
//           <p>Fees</p>
//           <p>Action</p>
//         </div>
//         {appointments.map((item, index) => (
//           <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
//             <p className='max-sm:hidden'>{index+1}</p>
//             <div className='flex items-center gap-2'>
//               <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
//             </div>
//             <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
//             <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
//             <div className='flex items-center gap-2'>
//               <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt="" /> <p>{item.docData.name}</p>
//             </div>
//             <p>{currency}{item.amount}</p>
//             {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
//           </div>
//         ))}
//       </div>

//     </div>
//   )
// }

// export default AllAppointments




import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, updateAppointmentStatus } = useContext(AdminContext);
  const { currency } = useContext(AppContext);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Group appointments by employees (assuming employee name is part of the docData)
  const employees = Array.from(
    new Set(appointments.map((item) => item.docData.name)) // assuming employee name is inside docData
  );

  // Calculate the details of an employee's appointments
  const getEmployeeDetails = (employee) => {
    const employeeAppointments = appointments.filter(
      (item) => item.docData.name === employee
    );

    const today = new Date().toISOString().split('T')[0]; // Current date in ISO format (e.g., 2025-01-24)
    const todayAppointments = employeeAppointments.filter(
      (item) => item.slotDate.split(' | ')[0] === today // Assuming slotDate is in "DD_MM_YYYY" format
    );

    const cancelledAppointments = employeeAppointments.filter(
      (item) => item.cancelled === true
    );

    const completedAppointments = employeeAppointments.filter(
      (item) => item.isCompleted === true
    );

    const todayFees = todayAppointments
      .filter((item) => item.isCompleted === true)
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      totalAppointments: employeeAppointments.length,
      todayAppointments: todayAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      completedAppointments: completedAppointments.length,
      todayFees,
    };
  };

  // Calculate the total counts of cancelled and completed appointments across all employees
  const getTotalCancelledAppointments = () => {
    return appointments.filter((item) => item.cancelled === true).length;
  };

  const getTotalCompletedAppointments = () => {
    return appointments.filter((item) => item.isCompleted === true).length;
  };

  // Open the employee's appointment details in a modal
  const openEmployeeModal = (employee) => {
    const details = getEmployeeDetails(employee);
    setSelectedEmployee({ name: employee, ...details });
    setIsModalOpen(true);
  };

  // Handle changing appointment status (cancelled or completed)
  const handleStatusChange = (appointmentId, status) => {
    // Call updateAppointmentStatus with the appointment ID and the new status
    updateAppointmentStatus(appointmentId, status);

    // Re-fetch appointments to reflect the updated status
    getAllAppointments();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <p className="mb-6 text-2xl font-semibold text-gray-800">Admin Panel - Employee Management</p>

  

      {/* Employee-Specific Containers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {employees.map((employee, index) => {
          const details = getEmployeeDetails(employee);
          return (
            <div
              key={index}
              className="p-6 bg-gray-100 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200 shadow-md"
              onClick={() => openEmployeeModal(employee)}
            >
              <p className="text-xl font-medium text-gray-800">{employee}</p>
              <p className="text-lg">Total Appointments: {details.totalAppointments}</p>
              <p className="text-lg text-green-700">
                Today's Appointments: {details.todayAppointments}
              </p>
              <p className="text-lg text-red-700">
                Cancelled: {details.cancelledAppointments}
              </p>
              <p className="text-lg text-blue-700">
                Completed: {details.completedAppointments}
              </p>
            </div>
          );
        })}
      </div>

      {/* Employee Summary Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {selectedEmployee.name} - Summary
            </h2>
            <div className="space-y-4">
              <p className="text-lg">Total Appointments: {selectedEmployee.totalAppointments}</p>
              <p className="text-lg text-green-700">
                Today's Appointments: {selectedEmployee.todayAppointments}
              </p>
              <p className="text-lg text-purple-700">
                Today's Total Fees: {currency} {selectedEmployee.todayFees}
              </p>
              <p className="text-lg text-red-700">
                Cancelled Appointments: {selectedEmployee.cancelledAppointments}
              </p>
              <p className="text-lg text-blue-700">
                Completed Appointments: {selectedEmployee.completedAppointments}
              </p>

              {/* Buttons for handling status change */}
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
