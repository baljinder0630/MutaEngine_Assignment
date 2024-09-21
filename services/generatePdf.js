import PDFDocument from 'pdfkit';
import fs from 'fs';

const generateInvoice = (paymentDetails) => {
    const doc = new PDFDocument();
    const invoicePath = `invoices/invoice_${paymentDetails.id}.pdf`;

    // Create a write stream for the PDF file
    doc.pipe(fs.createWriteStream(invoicePath));

    // Title
    doc.fontSize(25).text('Invoice', { align: 'center' }).moveDown();

    // Invoice Details
    doc.fontSize(12)
        .text(`Payment ID: ${paymentDetails.id}`, { align: 'left' })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' })
        .moveDown();

    // Invoice Description
    doc.fontSize(14).text('Invoice Description:', { underline: true }).moveDown();
    doc.fontSize(12).text(`Thank you for your recent purchase! This invoice serves as a confirmation of your transaction. Below are the details of your order:`).moveDown();

    // Product Details
    doc.text(`Product Name: USB-C Hub`);
    doc.text(`Quantity: 1`);
    doc.text(`Price: ₹3,999`);
    doc.text(`Payment Method: Credit Card (Visa ending in 1111)`);
    doc.text(`Transaction ID: pay_OzlNXMrY2zvqWg`);
    doc.text(`Date of Purchase: ${new Date().toLocaleDateString()}`).moveDown();

    // Billing Address
    doc.fontSize(14).text('Billing Address:', { underline: true }).moveDown();
    doc.fontSize(12)
        .text(`Baljinder Singh`)
        .text(`[Your Address Here]`)
        .text(`[City, State, Zip Code]`).moveDown();

    // Footer
    doc.fontSize(12).text(`We appreciate your business and hope you enjoy your new product. If you have any questions or concerns regarding your order, please feel free to reach out to our customer service team at support@example.com.`).moveDown();

    doc.text(`Thank you for choosing us!`, { align: 'center' });

    // Finalize the PDF and end the stream
    doc.end();

    return invoicePath;
};

export default generateInvoice;
