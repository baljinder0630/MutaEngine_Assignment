import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import Order from '../models/order.js';  // New Order schema
import Product from '../models/product.js';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const proceedToCheckout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId, userId } = req.body;

        // Check if productId and userId are provided
        if (!productId) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Product ID is required.',
            });
        }

        if (!userId) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'User ID is required.',
            });
        }

        // Fetch product details from the database
        const product = await Product.findById(productId);
        if (!product) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }

        const price = product.price;

        // Create an order in MongoDB
        const newOrder = new Order({
            customerId: userId,
            productId: product._id,
            price: price,
            paymentGatewayOrderId: '',  // Will be updated after creating the Razorpay order
            status: 'pending',
        });

        // Save the new order temporarily (within the session)
        const savedOrder = await newOrder.save({ session });

        // Create an order in Razorpay
        const options = {
            amount: price * 100,  // Amount in paise
            currency: 'INR',
            receipt: `receipt_${savedOrder._id}`,  // Link to MongoDB order
        };
        const razorpayOrder = await razorpay.orders.create(options);

        // Update the MongoDB order with the Razorpay order ID
        savedOrder.paymentGatewayOrderId = razorpayOrder.id;
        await savedOrder.save({ session });

        // Commit the transaction if everything is successful
        await session.commitTransaction();

        // Send the success response with Razorpay order details
        return res.status(201).json({
            success: true,
            message: 'Order created successfully.',
            orderId: savedOrder._id,
            paymentGatewayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });
    } catch (error) {
        console.error('Error in checkout process:', error);

        // Abort the transaction in case of an error
        await session.abortTransaction();
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.',
        });
    } finally {
        // End the session
        session.endSession();
    }
};

export default proceedToCheckout;
