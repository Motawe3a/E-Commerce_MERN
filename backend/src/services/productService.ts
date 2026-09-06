import { isValidObjectId } from "mongoose";
import productModel from "../models/productModel";

export const getAllProducts = async () => {
    const products = await productModel.find();
    return { data: products, statusCode: 200 };
};

export const getProductById = async (id: string) => {
    if (!isValidObjectId(id)) {
        return { data: 'Invalid product id', statusCode: 400 };
    }

    const product = await productModel.findById(id);
    if (!product) {
        return { data: 'Product not found', statusCode: 404 };
    }

    return { data: product, statusCode: 200 };
};

interface ProductInput {
    title: string;
    image: string;
    price: number;
    stock: number;
    description?: string;
}

export const createProduct = async (input: ProductInput) => {
    const { title, image, price, stock } = input;
    if (!title || !image || price == null || stock == null) {
        return { data: 'title, image, price and stock are required', statusCode: 400 };
    }

    const product = await productModel.create(input);
    return { data: product, statusCode: 201 };
};

export const updateProduct = async (id: string, input: Partial<ProductInput>) => {
    if (!isValidObjectId(id)) {
        return { data: 'Invalid product id', statusCode: 400 };
    }

    const product = await productModel.findByIdAndUpdate(id, input, { new: true });
    if (!product) {
        return { data: 'Product not found', statusCode: 404 };
    }

    return { data: product, statusCode: 200 };
};

export const deleteProduct = async (id: string) => {
    if (!isValidObjectId(id)) {
        return { data: 'Invalid product id', statusCode: 400 };
    }

    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
        return { data: 'Product not found', statusCode: 404 };
    }

    return { data: 'Product deleted', statusCode: 200 };
};

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
};
