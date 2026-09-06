import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { MONGO_URI, PORT } from "./config";
import userRoute from "./routes/userRoutes";
import productRoute from "./routes/productRoutes";
import cartRoute from "./routes/cartRoutes";
import orderRoute from "./routes/orderRoutes";
import { seedInitialProducts } from "./services/productService";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        // seed the products collection with some initial data
        return seedInitialProducts();
    })
    .catch(() => console.log('failed to connect to MongoDB'));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
