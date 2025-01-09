// import express from "express";
// import cors from "cors";
// import 'dotenv/config';
// import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
// import userRouter from "./routes/userRoute.js";
// import barberRouter from "./routes/doctorRoute.js";
// import adminRouter from "./routes/adminRoute.js";

// const app = express();
// const port = process.env.PORT;

// // Allowing multiple origins in CORS configuration
// const corsOptions = {
//   origin: [
//     "https://voguedeploy-jtu2.vercel.app", // Allow this origin
//     "https://voguedeploy.vercel.app",      // Also allow this origin
//   ],
//   methods: ["POST", "GET", "PUT", "DELETE"],
//   credentials: true
// };

// // Connect to MongoDB and Cloudinary with error handling
// const connectServices = async () => {
//   try {
//     await connectDB();
//     await connectCloudinary();
//     console.log("Connected to MongoDB and Cloudinary successfully");
//   } catch (error) {
//     console.error("Error connecting to services:", error);
//     process.exit(1); // Exit the process if connections fail
//   }
// };

// connectServices();

// // Middlewares
// app.use(express.json());
// app.use(cors(corsOptions)); // Apply CORS middleware with multiple origins

// // API Endpoints
// app.use("/api/user", userRouter); // User routes
// app.use("/api/admin", adminRouter); // Admin routes
// app.use("/api/doctor", barberRouter); // Doctor (barber) routes

// // Default route
// app.get("/", (req, res) => {
//   res.send("API Working");
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server started on PORT:${port}`);
// });


import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import barberRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
const port = process.env.PORT;

// Allowing multiple origins in CORS configuration
// const corsOptions = {
//   origin: [
//     "https://voguedeploy-jtu2.vercel.app", // Allow this origin
//     "https://voguedeploy.vercel.app",      // Also allow this origin
//     "https://voguedeploy-x6fj-2mw7edzh5-hassans-projects-875553d4.vercel.app"
//   ],
//   methods: ["POST", "GET", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: [
//     "X-CSRF-Token", 
//     "X-Requested-With", 
//     "Accept", 
//     "Accept-Version", 
//     "Content-Length", 
//     "Content-MD5", 
//     "Content-Type", 
//     "Date", 
//     "X-Api-Version"
//   ],
// };

app.use(cors({
  origin: '*', // Allow all origins; change to specific origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Connect to MongoDB and Cloudinary with error handling
const connectServices = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log("Connected to MongoDB and Cloudinary successfully");
  } catch (error) {
    console.error("Error connecting to services:", error);
    process.exit(1); // Exit the process if connections fail
  }
};

connectServices();

// Middlewares
app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS middleware with multiple origins

// API Endpoints
app.use("/api/user", userRouter); // User routes
app.use("/api/admin", adminRouter); // Admin routes
app.use("/api/doctor", barberRouter); // Doctor (barber) routes

// Default route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
});
