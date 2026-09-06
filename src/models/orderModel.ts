import mongoose, { Schema, Document, Types } from 'mongoose';

export type OrderStatus = 'placed' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderItem {
    productId: Types.ObjectId;
    title: string;
    image: string;
    quantity: number;
    unitPrice: number;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    items: IOrderItem[];
    total: number;
    address: string;
    status: OrderStatus;
    paymentStatus: 'paid';
}

const orderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
}, { _id: false });

const orderSchema: Schema<IOrder> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['placed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
    // Payment is mocked in this project: checkout always records a paid order.
    paymentStatus: { type: String, enum: ['paid'], default: 'paid' }
}, { timestamps: true });

const orderModel = mongoose.model<IOrder>('Order', orderSchema);

export default orderModel;
