import { isValidObjectId } from "mongoose";
import cartModel from "../models/cartModel";
import orderModel, { IOrderItem } from "../models/orderModel";
import productModel from "../models/productModel";

interface CheckoutParams {
    userId: string;
    address: string;
}

export const checkout = async ({ userId, address }: CheckoutParams) => {
    if (!address || typeof address !== "string") {
        return { data: "A shipping address is required", statusCode: 400 };
    }

    const cart = await cartModel.findOne({ userId, status: "active" });
    if (!cart || cart.items.length === 0) {
        return { data: "Cart is empty", statusCode: 400 };
    }

    // Load every referenced product and re-check availability before charging.
    const products = await productModel.find({
        _id: { $in: cart.items.map((item) => item.productId) }
    });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));

    const orderItems: IOrderItem[] = [];
    for (const item of cart.items) {
        const product = productsById.get(item.productId.toString());
        if (!product) {
            return { data: "A product in your cart no longer exists", statusCode: 400 };
        }
        if (item.quantity > product.stock) {
            return {
                data: `Only ${product.stock} unit(s) of "${product.title}" in stock`,
                statusCode: 400
            };
        }
        orderItems.push({
            productId: product._id,
            title: product.title,
            image: product.image,
            quantity: item.quantity,
            unitPrice: product.price
        });
    }

    // Mock payment succeeds here. Not wrapped in a Mongo transaction because that
    // requires a replica set; acceptable for this simple flow.
    for (const item of cart.items) {
        await productModel.updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } }
        );
    }

    const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const order = await orderModel.create({
        userId,
        items: orderItems,
        total,
        address,
        status: "placed",
        paymentStatus: "paid"
    });

    cart.status = "completed";
    await cart.save();

    return { data: order, statusCode: 201 };
};

export const getMyOrders = async ({ userId }: { userId: string }) => {
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    return { data: orders, statusCode: 200 };
};

export const getOrderById = async ({ userId, orderId }: { userId: string; orderId: string }) => {
    if (!isValidObjectId(orderId)) {
        return { data: "Invalid order id", statusCode: 400 };
    }

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
        return { data: "Order not found", statusCode: 404 };
    }

    return { data: order, statusCode: 200 };
};
