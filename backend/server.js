

// import express from "express";
// import cors from 'cors';
// import 'dotenv/config';
// import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
// import userRouter from "./routes/userRoute.js";
// import barberRouter from "./routes/doctorRoute.js";
// import adminRouter from "./routes/adminRoute.js";
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Connect to MongoDB and Cloudinary
// connectDB();
// connectCloudinary();

// const corsOptions = {
//   origin: port,
//   methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }

// // Middlewares
// app.use(express.json());
// app.use(cors());

// // API Endpoints
// app.use("/api/user", userRouter);           // User routes
// app.use("/api/admin", adminRouter);         // Admin routes
// app.use("/api/doctor", barberRouter);       // barber routes


// // Default route
// app.get("/", (req, res) => {
//   res.send("API Working");
// });

// // Start server
// app.listen(port, () => console.log(`Server started on PORT:${port}`));

import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import barberRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Allowing multiple origins in CORS configuration
const corsOptions = {
  origin: [
    "https://voguedeploy.vercel.app", // Allow this origin
    "https://voguedeploy-4agg.vercel.app",      // Also allow this origin
  ],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,  // Enable cookies or other credentials if required
};

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
