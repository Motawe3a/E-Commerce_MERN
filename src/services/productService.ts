import productModel from "../models/productModel";

export const getAllProducts = async () => {
    const products = await productModel.find();
    return products;
}

export const seedInitialProducts = async () => {
    const initialProducts = [
        { title: "Product 1", image: "https://via.placeholder.com/150", price: 100, stock: 10 },
        { title: "Product 2", image: "https://via.placeholder.com/150", price: 200, stock: 20 },
        { title: "Product 3", image: "https://via.placeholder.com/150", price: 300, stock: 30 }
    ];

    const productsCount = await productModel.countDocuments();
    if (productsCount === 0) {
        await productModel.insertMany(initialProducts);
    }
}