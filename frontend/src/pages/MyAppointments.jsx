// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { assets } from '../assets/assets';

// const MyAppointments = () => {
//   const { backendUrl, token } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [appointments, setAppointments] = useState([]);
//   const [payment, setPayment] = useState('');
//   const [workers, setWorkers] = useState([]);
//   const [statusMessage, setStatusMessage] = useState('');

//   const API_URL = 'http://localhost:4000/api/worker';

//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   // Function to format the date
//   const slotDateFormat = (slotDate) => {
//     const dateArray = slotDate.split('_');
//     return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2];
//   };

//   // Fetch user appointments
//   const getUserAppointments = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
//       setAppointments(data.appointments.reverse());
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       toast.error(error.message);
//     }
//   };

//   // Cancel appointment
//   const cancelAppointment = async (appointmentId) => {


  

//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/user/cancel-appointment`,
//         { appointmentId },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getUserAppointments();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error('Error cancelling appointment:', error);
//       toast.error(error.message);
//     }
//   };

//   // Razorpay payment initialization
//   const initPay = (order) => {
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: 'Appointment Payment',
//       description: 'Appointment Payment',
//       order_id: order.id,
//       handler: async (response) => {
//         try {
//           const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, response, { headers: { token } });
//           if (data.success) {
//             navigate('/my-appointments');
//             getUserAppointments();
//           }
//         } catch (error) {
//           console.error('Error verifying payment:', error);
//           toast.error(error.message);
//         }
//       },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   // Razorpay payment
//   const appointmentRazorpay = async (appointmentId) => {
//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/user/payment-razorpay`,
//         { appointmentId },
//         { headers: { token } }
//       );
//       if (data.success) {
//         initPay(data.order);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error('Error initiating payment:', error);
//       toast.error(error.message);
//     }
//   };

//   // Stripe payment
//   const appointmentStripe = async (appointmentId) => {
//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/user/payment-stripe`,
//         { appointmentId },
//         { headers: { token } }
//       );
//       if (data.success) {
//         window.location.replace(data.session_url);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error('Error initiating payment:', error);
//       toast.error(error.message);
//     }
//   };

//   // Fetch workers
//   const fetchWorkers = async () => {
//     try {
//       const { data } = await axios.get(API_URL);
//       return data;
//     } catch (error) {
//       console.error('Error fetching workers:', error);
//       return [];
//     }
//   };

//   // Delete worker
//   const deleteWorker = async (workerId) => {
//     try {
//       await axios.delete(`${API_URL}/${workerId}`);
//       toast.success('Worker deleted successfully!');
//       const updatedWorkers = await fetchWorkers();
//       setWorkers(updatedWorkers);
//     } catch (error) {
//       console.error('Error deleting worker:', error);
//       toast.error('Failed to delete worker.');
//     }
//   };

//   const handleDeleteWorker = async (docId, slotDate, slotTime, selectedWorker, delid) => {
//     // Find the worker to delete based on the docId and selectedWorker
//     const workerToDelete = workers.find(
//       (worker) =>
//         worker.shopname === docId &&
//         worker.name === selectedWorker &&
//         worker.date === slotDate && // ensuring all parameters match
//         worker.slot === slotTime
//     );
  
//     if (!workerToDelete) {
//       setStatusMessage("Worker not found!");
//       return;
//     }
  
//     try {
//       // Deleting the worker
//       await axios.delete(`${API_URL}/${workerToDelete._id}`);
//       toast.success('Worker deleted successfully!');
  
//       // Fetch updated workers list
//       const updatedWorkers = await fetchWorkers();
//       setWorkers(updatedWorkers);
//     } catch (error) {
//       console.error('Error deleting worker:', error);
//     }
  
//     try {
//       // Cancel the appointment using the provided delid (appointment ID)
//       const { data } = await axios.post(
//         `${backendUrl}/api/user/cancel-appointment`,
//         { appointmentId: delid },
//         { headers: { token } }
//       );
  
//       if (data.success) {
//         toast.success(data.message);
//         getUserAppointments(); // Fetch updated appointments if needed
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error('Error cancelling appointment:', error);
//       toast.error('Failed to cancel appointment.');
//     }
//   };
  

//   // Combined effects
//   useEffect(() => {
//     if (token) {
//       getUserAppointments();
//     }

//     const getWorkersData = async () => {
//       const workersData = await fetchWorkers();
//       setWorkers(workersData);
//     };
//     getWorkersData();
//   }, [token]);

//     return (
//         <div>
//             <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
//             <div className=''>
//                 {appointments.map((item, index) => (
//                     <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
//                         <div>
//                             <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
//                         </div>
//                         <div className='flex-1 text-sm text-[#5E5E5E]'>
//                             <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
//                             <p>{item.docData.speciality}</p>
//                             <p className='text-[#464646] font-medium mt-1'>Address:</p>
//                             <p className=''>{item.docData.address.line1}</p>
                            
//                             <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
//                         </div>
//                         <div></div>
//                         <div className='flex flex-col gap-2 justify-end text-sm text-center'>
//                             {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
//                             {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}
//                             {/* {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" /></button>} */}
//                             {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>Paid</button>}

//                             {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}

//                             {!item.cancelled && !item.isCompleted && <button
//                              onClick={()=>handleDeleteWorker(item.docId,item.slotDate,item.slotTime,item.selectedWorker,item._id)
                              
//                               // onClick={()=>cancelAppointment(item._id)
//                               }  className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
//                             {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <div>


        
//         {statusMessage && <div>{statusMessage}</div>}
//         <ul>
//           {workers.map((worker) => (
//             <li key={worker._id}>
//               {worker.name} - {worker.slot} - {worker.date}
//               <button onClick={() => deleteWorker(worker._id)}>Delete</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default MyAppointments;

// import React, { useContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { AppContext } from '../context/AppContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { assets } from '../assets/assets'

// const MyAppointments = () => {

//     const { backendUrl, token } = useContext(AppContext)
//     const navigate = useNavigate()

//     const [appointments, setAppointments] = useState([])
//     const [payment, setPayment] = useState('')

//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
//     const slotDateFormat = (slotDate) => {
//         const dateArray = slotDate.split('_')
//         return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
//     }

//     // Getting User Appointments Data Using API
//     const getUserAppointments = async () => {
//         try {

//             const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
//             setAppointments(data.appointments.reverse())

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }

//     // Function to cancel appointment Using API
//     const cancelAppointment = async (appointmentId) => {

//         try {

//             const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

//             if (data.success) {
//                 toast.success(data.message)
//                 getUserAppointments()
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }

//     const initPay = (order) => {
//         const options = {
//             key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//             amount: order.amount,
//             currency: order.currency,
//             name: 'Appointment Payment',
//             description: "Appointment Payment",
//             order_id: order.id,
//             receipt: order.receipt,
//             handler: async (response) => {

//                 console.log(response)

//                 try {
//                     const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
//                     if (data.success) {
//                         navigate('/my-appointments')
//                         getUserAppointments()
//                     }
//                 } catch (error) {
//                     console.log(error)
//                     toast.error(error.message)
//                 }
//             }
//         };
//         const rzp = new window.Razorpay(options);
//         rzp.open();
//     };

//     // Function to make payment using razorpay
//     const appointmentRazorpay = async (appointmentId) => {
//         try {
//             const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
//             if (data.success) {
//                 initPay(data.order)
//             }else{
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }

//     // Function to make payment using stripe
//     const appointmentStripe = async (appointmentId) => {
//         try {
//             const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
//             if (data.success) {
//                 const { session_url } = data
//                 window.location.replace(session_url)
//             }else{
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }



//     useEffect(() => {
//         if (token) {
//             getUserAppointments()
//         }
//     }, [token])

//     return (
//         <div>
//             <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
//             <div className=''>
//                 {appointments.map((item, index) => (
//                     <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
//                         <div>
//                             <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
//                         </div>
//                         <div className='flex-1 text-sm text-[#5E5E5E]'>
//                             <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
//                             <p>{item.docData.speciality}</p>
//                             <p className='text-[#464646] font-medium mt-1'>Address:</p>
//                             <p className=''>{item.docData.address.line1}</p>
//                             <p className=''>{item.docData.address.line2}</p>
//                             <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
//                         </div>
//                         <div></div>
//                         <div className='flex flex-col gap-2 justify-end text-sm text-center'>
//                             {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
//                             {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}
//                             {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" /></button>}
//                             {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>Paid</button>}

//                             {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}

//                             {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
//                             {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default MyAppointments


import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p className=''>{item.docData.address.line1}</p>
                            
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}
                            {/* {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" /></button>} */}
                            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>Paid</button>}

                            {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}

                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments
