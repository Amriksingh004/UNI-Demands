import mongoose from "mongoose";
import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { GetUniversities } from "./controllers/UniversityController.js";
import router from "./routes/staticRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
const allowedLocalOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools or same-origin
    // allow listed localhost origins or any localhost with a port
    if (
      allowedLocalOrigins.indexOf(origin) !== -1 ||
      /^http:\/\/localhost:\d+$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/api/orders", orderRoutes);


// app.use("/",authMiddleware,router);
app.use("/",router);
 

app.use(express.static("public/universityImg/"))
app.use(express.static("public/departmentImg"));
app.use(express.static("public/productImg"));
app.use(express.static("public/userImg"));




mongoose.connect(process.env.DB_URL).then((d) => {
  console.log("database Connected");

  app.listen(process.env.PORT, () => {
    console.log("server started at http://localhost:" + process.env.PORT)
  });
}).catch((e) => {
  console.log(e);
});