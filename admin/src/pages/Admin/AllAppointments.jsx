
import React, { useContext, useEffect, useState } from 'react';
import { DContext } from '../../context/DContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DAppointments = () => {
  const { dToken, appointments, getAppointments } = useContext(DContext);
  const { currency } = useContext(AppContext);
  const [todayDetails, setTodayDetails] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const handleTodayDetails = () => {
    const todayAppointments = appointments.filter(
      (appointment) => appointment.slotDate === today
    );
    const totalFee = todayAppointments.reduce((sum, item) => sum + item.amount, 0);
    const cancelledCount = todayAppointments.filter((item) => item.cancelled).length;
    const completedCount = todayAppointments.filter((item) => item.isCompleted).length;
    const pendingCount =
      todayAppointments.length - cancelledCount - completedCount;
    const shopNames = [...new Set(todayAppointments.map((item) => item.shopName))];

    setTodayDetails({
      totalFee,
      totalAppointments: todayAppointments.length,
      cancelledCount,
      completedCount,
      pendingCount,
      shopNames,
    });
    setIsPopupOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <p className="mb-5 text-2xl font-bold text-gray-800">Appointments Dashboard</p>

      {/* Today's Summary Container */}
      <div
        className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={handleTodayDetails}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-semibold">Today's Summary</p>
          
            <p className="text-lg mt-2">Amount: {currency}{todayDetails?.totalFee || 0}</p>
            <p className="text-lg">Total Appointments: {todayDetails?.totalAppointments || 0}</p>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <img src={assets.calendar_icon} alt="Calendar" className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && todayDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Details</h2>
            <div className="text-lg text-gray-700 space-y-2">
              <p>Total Appointments: {todayDetails.totalAppointments}</p>
              <p>Completed Appointments: {todayDetails.completedCount}</p>
              <p>Cancelled Appointments: {todayDetails.cancelledCount}</p>
              <p>Pending Appointments: {todayDetails.pendingCount}</p>
              <p>Total Fees: {currency}{todayDetails.totalFee}</p>
              <p>Shops Involved:</p>
              <ul className="list-disc list-inside">
                {todayDetails.shopNames.map((shop, index) => (
                  <li key={index}>{shop}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DAppointments;
