import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoutes";
import { seedInitialProducts } from "./services/productService";

// import { router } from "./routes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use('/users', userRoute);

mongoose.connect("mongodb://localhost:27017/ecommerce")
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log('failed to connect to MongoDB'));

// seed the products collection with some initial data
seedInitialProducts();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));