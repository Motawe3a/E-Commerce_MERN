import mongoose, { Schema, Document, Types } from 'mongoose';

export type CartStatus = 'active' | 'completed';

export interface ICartItem {
    productId: Types.ObjectId;
    quantity: number;
    unitPrice: number;
}

export interface ICart extends Document {
    userId: Types.ObjectId;
    items: Types.DocumentArray<ICartItem>;
    totalAmount: number;
    status: CartStatus;
}

const cartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true }
}, { _id: false });

const cartSchema: Schema<ICart> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [cartItemSchema], default: [] },
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

const cartModel = mongoose.model<ICart>('Cart', cartSchema);

export default cartModel;
