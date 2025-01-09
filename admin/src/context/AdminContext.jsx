// import axios from "axios";
// import { createContext, useState } from "react";
// import { toast } from "react-toastify";


// export const AdminContext = createContext()

// const AdminContextProvider = (props) => {

//     const backendUrl = import.meta.env.VITE_BACKEND_URL

//     const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

//     const [appointments, setAppointments] = useState([])
//     const [doctors, setDoctors] = useState([])
//     const [dashData, setDashData] = useState(false)

//     // Getting all Barber data from Database using API
//     const getAllD = async () => {

//         try {

//             const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
//             if (data.success) {
//                 setDoctors(data.doctors)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }

//     }

//     // Function to change barber availablity using API
//     const changeAvailability = async (docId) => {
//         try {

//             const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
//             if (data.success) {
//                 toast.success(data.message)
//                 getAllD()
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }


//     // Getting all appointment data from Database using API
//     const getAllAppointments = async () => {

//         try {

//             const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
//             if (data.success) {
//                 setAppointments(data.appointments.reverse())
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//             console.log(error)
//         }

//     }

//     // Function to cancel appointment using API
//     const cancelAppointment = async (appointmentId) => {

//         try {

//             const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

//             if (data.success) {
//                 toast.success(data.message)
//                 getAllAppointments()
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//             console.log(error)
//         }

//     }

//     // Getting Admin Dashboard data from Database using API
//     const getDashData = async () => {
//         try {

//             const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

//             if (data.success) {
//                 setDashData(data.dashData)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }

//     const value = {
//         aToken, setAToken,
//         doctors,
//         getAllD,
//         changeAvailability,
//         appointments,
//         getAllAppointments,
//         getDashData,
//         cancelAppointment,
//         dashData
//     }

//     return (
//         <AdminContext.Provider value={value}>
//             {props.children}
//         </AdminContext.Provider>
//     )

// }

// export default AdminContextProvider


import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dashData, setDashData] = useState(false);

  // Axios default configuration with withCredentials
  const axiosConfig = {
    headers: { aToken },
    withCredentials: true, // Enable credentials with the request
  };

  // Getting all Barber data from Database using API
  const getAllD = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', axiosConfig);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to change barber availability using API
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, axiosConfig);
      if (data.success) {
        toast.success(data.message);
        getAllD();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Getting all appointment data from Database using API
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', axiosConfig);
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Function to cancel appointment using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, axiosConfig);
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Getting Admin Dashboard data from Database using API
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', axiosConfig);
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    aToken, setAToken,
    doctors,
    getAllD,
    changeAvailability,
    appointments,
    getAllAppointments,
    getDashData,
    cancelAppointment,
    dashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
