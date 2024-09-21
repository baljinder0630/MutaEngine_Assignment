import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import dotenv from 'dotenv'
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
    '127.0.0.1' // Localhost for testing
];

const isRazorpayIp = (ip) => {
    const whitelist = RAZORPAY_IPS.map(item => item.trim().toLowerCase());

    // Normalize the IP by removing the IPv6-mapped prefix if it exists
    const normalizedIp = ip.trim().toLowerCase().replace(/^::ffff:/, '');

    // Check if the normalized IP is in the whitelist
    return whitelist.includes(normalizedIp);
};

const ipCheck = async (req, res, next) => {
    try {
        let clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        // In case of multiple IPs in x-forwarded-for (comma-separated), take the first one
        if (clientIP.includes(',')) {
            clientIP = clientIP.split(',')[0];
        }

        console.log("Client IP Address:", clientIP);

        if (!isRazorpayIp(clientIP)) {
            console.error("Unauthorized IP:", clientIP);
            return res.status(403).json({ success: false, message: "Unauthorized IP" });
        }

        next(); // Proceed if IP is authorized
    } catch (error) {
        console.error("IP check error:", error);
        return res.status(403).json({ success: false, message: "Internal server issue" });
    }
};

const signatureCheck = (req, res, next) => {
    try {
        const webhookBody = req.body;
        const webhookSignature = req.headers['x-razorpay-signature'] ?? '';

        // Validate the webhook signature
        const isValidSignature = validateWebhookSignature(
            JSON.stringify(webhookBody),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isValidSignature) {
            console.error('Invalid signature:', JSON.stringify(webhookBody));
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        next(); // Proceed if signature is valid
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { ipCheck, signatureCheck };