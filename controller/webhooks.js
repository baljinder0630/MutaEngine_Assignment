import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import Order from '../models/order.js';
import generateInvoice from '../services/generatePdf.js';
import { sendInvoiceEmail } from '../services/sendEmail.js';
dotenv.config();
const RAZORPAY_IPS = [
    '52.66.75.174',
    '52.66.76.63',
    '52.66.151.218',
    '35.154.217.40',
    '35.154.22.73',
    '35.154.143.15',
    '13.126.199.247',
    '13.126.238.192',
    '13.232.194.134',
    '127.0.0.1'
];

const isRazorpayIp = (ip) => {
    return RAZORPAY_IPS.includes(ip)
};


const webhooks = async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Log the client's IP address
        console.log("Client IP Address:", clientIp);

        // Validate if the request is from Razorpay IP
        if (!isRazorpayIp(clientIp)) {
            console.error("Unauthorized IP:", clientIp);
            return res.status(403).json({ success: false, message: "Unauthorized IP" });
        }
        const webhookBody = req.body;
        const webhookSignature = req.headers['x-razorpay-signature'];

        // Validate the webhook signature
        const isValidSignature = validateWebhookSignature(
            JSON.stringify(webhookBody),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (isValidSignature) {
            const event = webhookBody;
            // console.log(event.payload.payment);
            switch (event.event) {
                case 'payment.authorized': {
                    const orderId = event.payload.payment.entity.order_id;
                    const paymentId = event.payload.payment.entity.id;

                    const order = await Order.findOneAndUpdate(
                        { paymentGatewayOrderId: orderId, status: "pending" },
                        {
                            status: 'processing',
                            paymentGatewayPaymentId: paymentId,
                            paymentStatus: 'processing',
                        },
                        { new: true }
                    );

                    if (order) {
                        res.status(200).json({
                            success: true,
                            message: 'Payment authorized and order updated successfully',
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: 'Failed to update order status',
                        });
                    }
                    break;
                }

                case 'payment.captured': {
                    const orderId = event.payload.payment.entity.order_id;
                    const paymentId = event.payload.payment.entity.id;

                    const updatedOrder = await Order.updateOne(
                        {
                            paymentGatewayOrderId: orderId,
                            paymentGatewayPaymentId: paymentId,
                            paymentStatus: 'processing',
                        },
                        { paymentStatus: 'completed' }
                    );

                    if (updatedOrder) {
                        const path = await generateInvoice({ id: paymentId })
                        sendInvoiceEmail(event.payload.payment.entity.email, path);
                        res.status(200).json({
                            success: true,
                            message: 'Payment captured and order updated successfully',
                        });
                    } else {
                        logger.error('Error updating order in payment.captured event');
                        res.status(400).json({
                            success: false,
                            message: 'Failed to update order status',
                        });
                    }
                    break;
                }

                case 'payment.failed': {
                    const orderId = event.payload.payment.entity.order_id;

                    const order = await Order.findOneAndUpdate(
                        { paymentGatewayOrderId: orderId },
                        {
                            status: 'cancelled',
                            paymentStatus: 'failed',
                            cancelledBy: 'system',
                        },
                        { new: true }
                    );

                    if (order) {
                        res.status(200).json({
                            success: true,
                            message: 'Order cancelled successfully due to payment failure',
                        });
                    } else {
                        logger.error('Error cancelling order in payment.failed event');
                        res.status(400).json({
                            success: false,
                            message: 'Failed to cancel order',
                        });
                    }
                    break;
                }

                case 'refund.created': {
                    const orderId = event.payload.payment.entity.order_id;
                    const paymentId = event.payload.payment.entity.id;

                    const updatedOrder = await Order.updateOne(
                        {
                            paymentGatewayOrderId: orderId,
                            paymentGatewayPaymentId: paymentId,
                            refundStatus: { $ne: 'completed' },
                        },
                        {
                            refundStatus: 'initiated',
                            status: 'cancelled',
                            paymentStatus: 'refund',
                            refundId: event.payload.refund.entity.id,
                        }
                    );

                    if (updatedOrder) {
                        res.status(200).json({
                            success: true,
                            message: 'Refund initiated and order updated successfully',
                        });
                    } else {
                        logger.error('Error updating order in refund.created event');
                        res.status(400).json({
                            success: false,
                            message: 'Failed to update order status for refund initiation',
                        });
                    }
                    break;
                }

                case 'refund.processed': {
                    const orderId = event.payload.payment.entity.order_id;
                    const paymentId = event.payload.payment.entity.id;
                    const refundId = event.payload.refund.entity.id;

                    const order = await Order.findOneAndUpdate(
                        {
                            paymentGatewayOrderId: orderId,
                            paymentGatewayPaymentId: paymentId,
                        },
                        {
                            refundStatus: 'completed',
                            refundAmount: event.payload.payment.entity.amount_refunded / 100,
                            status: 'cancelled',
                            paymentStatus: 'refund',
                            refundId: refundId,
                        },
                        { new: true }
                    );

                    if (order) {
                        res.status(200).json({
                            success: true,
                            message: 'Refund processed successfully',
                        });
                    } else {
                        logger.error('Error updating order in refund.processed event');
                        res.status(400).json({
                            success: false,
                            message: 'Failed to update order status for refund',
                        });
                    }
                    break;
                }

                case 'refund.failed': {
                    const refundId = event.payload.refund.entity.id;
                    const paymentId = event.payload.payment.entity.id;
                    const orderId = event.payload.payment.entity.order_id;

                    const order = await Order.findOneAndUpdate(
                        {
                            paymentGatewayOrderId: orderId,
                            paymentGatewayPaymentId: paymentId,
                        },
                        {
                            refundStatus: 'failed',
                            status: 'cancelled',
                            paymentStatus: 'refund',
                            refundId: refundId,
                        },
                        { new: true }
                    );

                    if (order) {
                        res.status(200).json({
                            success: true,
                            message: 'Refund failed and order status updated',
                        });
                    } else {
                        logger.error('Error updating order in refund.failed event');
                        res.status(400).json({
                            success: false,
                            message: 'Failed to update order status for refund failure',
                        });
                    }
                    break;
                }

                default:
                    logger.error(`Unhandled event: ${event.event}`);
                    res.status(400).json({
                        success: false,
                        message: `Unhandled event type: ${event.event}`,
                    });
            }
        } else {
            logger.error('Invalid signature ' + JSON.stringify(webhookBody));
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        logger.error('Error processing webhook:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export default webhooks;
