import express from "express";
import "dotenv/config";
import authRoutes from './routes/authRoutes.js'
import { connectDB } from "./lib/db.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Add this line!
app.use(express.urlencoded({ extended: true })); // For form data

app.use(cors());

app.use('/api/auth', authRoutes);

// console.log("PORT", PORT);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {

// console.log("listen on localhost 3k");
connectDB()
  .then(() => {
    // console.log(`Server is running on port ${PORT}`);
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
});