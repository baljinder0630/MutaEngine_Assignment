import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the Product schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a pre-save hook to update the updatedAt field
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;