// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
//     useContext(AppContext);
//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//   const [showAddress] = useState(false);
//   const handleOpenGoogleMaps = () => {
//     const address = docInfo.address.line1;
    
//     window.open(docInfo.address.line1, "_blank"); // Opens the address in a new tab
//   };
  
  

//   const [docInfo, setDocInfo] = useState(false);
//   const [docSlots, setDocSlots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState("");
//   const [selectedService, setSelectedService] = useState("");

//   const navigate = useNavigate();

//   const fetchDocInfo = async () => {
//     const docInfo = doctors.find((doc) => doc._id === docId);
//     setDocInfo(docInfo);
//   };

//   const getAvailableSolts = async () => {
//     setDocSlots([]);
//     let today = new Date();

//     for (let i = 0; i < 7; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       let endTime = new Date();
//       endTime.setDate(today.getDate() + i);
//       endTime.setHours(21, 0, 0, 0);

//       if (today.getDate() === currentDate.getDate()) {
//         currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }

//       let timeSlots = [];

//       while (currentDate < endTime) {
//         let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//         let day = currentDate.getDate();
//         let month = currentDate.getMonth() + 1;
//         let year = currentDate.getFullYear();

//         const slotDate = `${day}_${month}_${year}`;
//         const slotTime = formattedTime;

//         const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

//         if (isSlotAvailable) {
//           timeSlots.push({
//             datetime: new Date(currentDate),
//             time: formattedTime,
//           });
//         }

//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }

//       setDocSlots((prev) => [...prev, timeSlots]);
//     }
//   };

//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warning("Login to book appointment");
//       return navigate("/login");
//     }

//     if (!selectedService) {
//       toast.warning("Please select a service before booking the appointment");
//       return;
//     }

//     const date = docSlots[slotIndex][0].datetime;

//     let day = date.getDate();
//     let month = date.getMonth() + 1;
//     let year = date.getFullYear();

//     const slotDate = `${day}_${month}_${year}`;
//     // selectedService = service.fee 

//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/user/book-appointment",
//         { docId, slotDate, slotTime, selectedService },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         navigate("/my-appointments");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (doctors.length > 0) {
//       fetchDocInfo();
//     }
//   }, [doctors, docId]);

//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSolts();
//     }
//   }, [docInfo]);

//   return docInfo ? (
//     <div>
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div>
//           <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
//         </div>

//         <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//           <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
//             {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
//           </p>
//           {/* <div className="flex items-center gap-2 mt-1 text-gray-600">
//             <p>
//               {docInfo.about}
//             </p>
//             <button className="py-0.5 px-2 border text-xs rounded-full">
//               {docInfo.experience}
//             </button>
//           </div> */}
//           <p className="text-gray-600 font-medium mt-4">
//             About: <span className="text-gray-800">{docInfo.about}</span>
//           </p>
//           <p className="text-gray-600 font-medium mt-4">
//             Address: <span className="text-gray-800">{docInfo.address.line1}</span>
//           </p>

//           <button
//       onClick={handleOpenGoogleMaps}
//       className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
//     >
//       {showAddress ? docInfo.address.line1 : "Show Address"}
//     </button>

//         </div>
//       </div>

//       <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
//         <p>Booking slots</p>
//         <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//           {docSlots.length &&
//             docSlots.map((item, index) => (
//               <div
//                 onClick={() => setSlotIndex(index)}
//                 key={index}
//                 className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "border border-[#DDDDDD]"}`}
//               >
//                 <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                 <p>{item[0] && item[0].datetime.getDate()}</p>
//               </div>
//             ))}
//         </div>

//         <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
//           {docSlots.length &&
//             docSlots[slotIndex].map((item, index) => (
//               <p
//                 onClick={() => setSlotTime(item.time)}
//                 key={index}
//                 className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-[#949494] border border-[#B4B4B4]"}`}
//               >
//                 {item.time.toLowerCase()}
//               </p>
//             ))}

            
//         </div>
//         <select
//           value={selectedService}
//           onChange={(e) => setSelectedService(e.target.value)}
//           className="border px-4 py-2 mt-2 rounded-lg"
//         >
//           <option value="" disabled>
//             Select a service
//           </option>
//           {docInfo.services.map((service, index) => (
//             <option key={index} value={service.fee}>
//               {service.service} - {currencySymbol}{service.fee}

//             </option>
            
//           ))}
//         </select>
        
        

//        <br></br>
//         <button
//           onClick={bookAppointment}
//           className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
//         >
//           Book an appointment
//         </button>
//       </div>
//     </div>
//   ) : null;
// };

// export default Appointment;





import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:4000/api/worker";

 


const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [showAddress] = useState(false);
  const handleOpenGoogleMaps = () => {
    const address = docInfo.address.line1;
    window.open(docInfo.address.line1, "_blank"); // Opens the address in a new tab
  };

  const [docInfo, setDocInfo] = useState(false);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  
  const [selectedService, setSelectedService] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workers, setWorkers] = useState([]);

  
  const [newWorker, setNewWorker] = useState({ name: "", slot: "", date: "" });


  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSolts = async () => {
    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };






  const fetchWorkers = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/worker");
      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    if (!selectedService) {
      toast.warning("Please select a service before booking the appointment");
      return;
    }

    if (!selectedWorker) {
      toast.warning("Please select a worker before booking the appointment");
      return;
    }

    setIsLoading(true);

    const date = docSlots[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = `${day}_${month}_${year}`;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime, selectedService, worker: selectedWorker },
        { headers: { token } }
      );

      const hardcodedWorker = { name: selectedWorker, slot: slotTime, date: slotDate };
      await addWorker(hardcodedWorker);  // Passing hardcoded values
      setStatusMessage("Hardcoded worker added!");
  
      // Fetch and update the worker list after adding
      const updatedWorkers1 = await fetchWorkers1();
      setWorkers1(updatedWorkers1);

      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchWorkers();
  }, []);


  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
      fetchWorkers();
    }
  }, [docInfo]);




  const handleClick = () => {
    bookAppointment();
    
  
    // Extracting the selected date from the selected slot
    const selectedSlot = docSlots[slotIndex] && docSlots[slotIndex][0];
    const selectedDate = selectedSlot ? selectedSlot.datetime : null;
    
    if (selectedDate) {
      // Formatting the date as 'day_month_year' (e.g., '1_2_2025')
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1; // Add 1 because months are 0-indexed
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}_${month}_${year}`;
  
      console.log("Selected date:", formattedDate);  // Log the formatted date
    } else {
      console.log("No slot selected");
    }
    
    console.log("worker name ", selectedWorker)
    console.log("Selected slot time:", slotTime);
    console.log("Selected slot index:", slotIndex);
  };
  


  const [workers1, setWorkers1] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch workers1 when the component mounts
  useEffect(() => {
    const getWorkers1 = async () => {
      const workers1Data = await fetchWorkers1();
      setWorkers1(workers1Data);
    };

    getWorkers1();
  }, []); // This will run only once when the component mounts

  
  return docInfo ? (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <p className="text-gray-600 font-medium mt-4">
            About: <span className="text-gray-800">{docInfo.about}</span>
          </p>
          <p className="text-gray-600 font-medium mt-4">
            Address: <span className="text-gray-800">{docInfo.address.line1}</span>
          </p>

          <button
            onClick={handleOpenGoogleMaps}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            {showAddress ? docInfo.address.line1 : "Show Address"}
          </button>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "border border-[#DDDDDD]"}`}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-[#949494] border border-[#B4B4B4]"}`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border px-4 py-2 mt-2 rounded-lg"
        >
          <option value="" disabled>
            Select a service
          </option>
          {docInfo.services.map((service, index) => (
            <option key={index} value={service.fee}>
              {service.service} - {currencySymbol}{service.fee}
            </option>
          ))}
        </select>

       

        <select
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
          className="border px-4 py-2 mt-2 rounded-lg"
        >
          <option value="" disabled>
            Select a worker
          </option>
          {docInfo.workers.map((worker, index) => (
            <option key={index} value={worker}>
              {worker}
            </option>
          ))}
        </select>


        <br />
        
        <button
          onClick={handleClick}
          className={`bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Booking..." : "Book an appointment"}
        </button>



        
      </div>


    
    <div>
    

     

      <ul>
        {workers1.map((worker) => (
          <li key={worker._id}>
            {worker.name} - {worker.slot} - {worker.date}
          </li>
        ))}
      </ul>
    </div>
      

    </div>
    

  ) : null;
};

export default Appointment;

export const addWorker = async (worker) => {
  try {
    await axios.post(API_URL, worker);
    console.log("Worker added successfully!");
  } catch (error) {
    console.error("Error saving worker:", error);
  }
};

// Function to fetch all workers1
const fetchWorkers1 = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching workers1:", error);
    return [];
  }
};

