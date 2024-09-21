import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    paymentGatewayOrderId: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'accepted', 'completed', 'cancelled'],
        // pending -> order in cart
        // processng -> order not yet accepted by pharmacy
        // completed -> delivered , pickup completed
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refund'],
        // mapping with razorpay payment status as -> processing=authorized, completed=captured, failed=failed
    },
    refundStatus: {
        type: String,
        enum: ['initiated', 'completed', 'failed'],
        // mapping with razorpay refund status as -> initiated=created, completed=processed, failed=failed
    },
    refundId: {
        type: String,
        default: null,
    },
    refundAmount: {
        type: Number,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
