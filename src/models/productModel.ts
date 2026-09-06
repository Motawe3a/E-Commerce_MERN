import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    image: string;
    price: number;
    stock: number;
    description?: string;
}

const productSchema: Schema<IProduct> = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String }
}, { timestamps: true });

const productModel = mongoose.model<IProduct>('Product', productSchema);

export default productModel;
