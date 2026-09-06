import { isValidObjectId } from "mongoose";
import cartModel, { ICartItem } from "../models/cartModel";
import productModel from "../models/productModel";

const recalcTotal = (items: ICartItem[]) =>
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

const findOrCreateActiveCart = async (userId: string) => {
    const existing = await cartModel.findOne({ userId, status: "active" });
    if (existing) {
        return existing;
    }
    return cartModel.create({ userId, items: [], totalAmount: 0, status: "active" });
};

export const getActiveCart = async ({ userId }: { userId: string }) => {
    const cart = await findOrCreateActiveCart(userId);
    return { data: cart, statusCode: 200 };
};

interface AddItemParams {
    userId: string;
    productId: string;
    quantity: number;
}

export const addItemToCart = async ({ userId, productId, quantity }: AddItemParams) => {
    if (!isValidObjectId(productId)) {
        return { data: "Invalid product id", statusCode: 400 };
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
        return { data: "quantity must be a positive integer", statusCode: 400 };
    }

    const product = await productModel.findById(productId);
    if (!product) {
        return { data: "Product not found", statusCode: 404 };
    }

    const cart = await findOrCreateActiveCart(userId);
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    const desiredQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (desiredQuantity > product.stock) {
        return { data: `Only ${product.stock} unit(s) of "${product.title}" in stock`, statusCode: 400 };
    }

    if (existingItem) {
        existingItem.quantity = desiredQuantity;
        existingItem.unitPrice = product.price;
    } else {
        cart.items.push({ productId: product._id, quantity, unitPrice: product.price } as ICartItem);
    }

    cart.totalAmount = recalcTotal(cart.items);
    await cart.save();
    return { data: cart, statusCode: 200 };
};

interface UpdateItemParams {
    userId: string;
    productId: string;
    quantity: number;
}

export const updateItemInCart = async ({ userId, productId, quantity }: UpdateItemParams) => {
    if (!isValidObjectId(productId)) {
        return { data: "Invalid product id", statusCode: 400 };
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
        return { data: "quantity must be a positive integer", statusCode: 400 };
    }

    const cart = await findOrCreateActiveCart(userId);
    const item = cart.items.find((cartItem) => cartItem.productId.toString() === productId);
    if (!item) {
        return { data: "Item not in cart", statusCode: 404 };
    }

    const product = await productModel.findById(productId);
    if (!product) {
        return { data: "Product not found", statusCode: 404 };
    }
    if (quantity > product.stock) {
        return { data: `Only ${product.stock} unit(s) of "${product.title}" in stock`, statusCode: 400 };
    }

    item.quantity = quantity;
    item.unitPrice = product.price;
    cart.totalAmount = recalcTotal(cart.items);
    await cart.save();
    return { data: cart, statusCode: 200 };
};

export const removeItemFromCart = async ({ userId, productId }: { userId: string; productId: string }) => {
    if (!isValidObjectId(productId)) {
        return { data: "Invalid product id", statusCode: 400 };
    }

    const cart = await findOrCreateActiveCart(userId);
    const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );

    if (index === -1) {
        return { data: "Item not in cart", statusCode: 404 };
    }

    cart.items.splice(index, 1);

    cart.totalAmount = recalcTotal(cart.items);
    await cart.save();
    return { data: cart, statusCode: 200 };
};

export const clearCart = async ({ userId }: { userId: string }) => {
    const cart = await findOrCreateActiveCart(userId);
    cart.items.splice(0, cart.items.length);
    cart.totalAmount = 0;
    await cart.save();
    return { data: cart, statusCode: 200 };
};
