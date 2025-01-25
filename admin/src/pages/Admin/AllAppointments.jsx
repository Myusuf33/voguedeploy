
// import React, { useContext, useEffect, useState } from 'react';
// import { DContext } from '../../context/DContext';
// import { AppContext } from '../../context/AppContext';
// import { assets } from '../../assets/assets';

// const DAppointments = () => {
//   const { dToken, appointments, getAppointments } = useContext(DContext);
//   const { currency } = useContext(AppContext);
//   const [todayDetails, setTodayDetails] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   const today = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//     if (dToken) {
//       getAppointments();
//     }
//   }, [dToken]);

//   const handleTodayDetails = () => {
//     const todayAppointments = appointments.filter(
//       (appointment) => appointment.slotDate === today
//     );
//     const totalFee = todayAppointments.reduce((sum, item) => sum + item.amount, 0);
//     const cancelledCount = todayAppointments.filter((item) => item.cancelled).length;
//     const completedCount = todayAppointments.filter((item) => item.isCompleted).length;
//     const pendingCount =
//       todayAppointments.length - cancelledCount - completedCount;
//     const shopNames = [...new Set(todayAppointments.map((item) => item.shopName))];

//     setTodayDetails({
//       totalFee,
//       totalAppointments: todayAppointments.length,
//       cancelledCount,
//       completedCount,
//       pendingCount,
//       shopNames,
//     });
//     setIsPopupOpen(true);
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto p-6">
//       <p className="mb-5 text-2xl font-bold text-gray-800">Appointments Dashboard</p>

//       {/* Today's Summary Container */}
//       <div
//         className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
//         onClick={handleTodayDetails}
//       >
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-2xl font-semibold">Today's Summary</p>
          
//             <p className="text-lg mt-2">Amount: {currency}{todayDetails?.totalFee || 0}</p>
//             <p className="text-lg">Total Appointments: {todayDetails?.totalAppointments || 0}</p>
//           </div>
//           <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//             <img src={assets.calendar_icon} alt="Calendar" className="w-10 h-10" />
//           </div>
//         </div>
//       </div>

//       {/* Popup Modal */}
//       {isPopupOpen && todayDetails && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Details</h2>
//             <div className="text-lg text-gray-700 space-y-2">
//               <p>Total Appointments: {todayDetails.totalAppointments}</p>
//               <p>Completed Appointments: {todayDetails.completedCount}</p>
//               <p>Cancelled Appointments: {todayDetails.cancelledCount}</p>
//               <p>Pending Appointments: {todayDetails.pendingCount}</p>
//               <p>Total Fees: {currency}{todayDetails.totalFee}</p>
//               <p>Shops Involved:</p>
//               <ul className="list-disc list-inside">
//                 {todayDetails.shopNames.map((shop, index) => (
//                   <li key={index}>{shop}</li>
//                 ))}
//               </ul>
//             </div>
//             <button
//               onClick={() => setIsPopupOpen(false)}
//               className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 w-full"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DAppointments;




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
