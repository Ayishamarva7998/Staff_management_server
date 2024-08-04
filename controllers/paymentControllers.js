import { Staff } from '../models/staff.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';

// Helper function to generate PDF
function generateBill(billDetails) {
    const dir = './bills';
    const filePath = path.join(dir, `${billDetails.notes.userid}.pdf`);

    // Check if directory exists, if not create it
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));

    // Company Info
    doc.fontSize(20).fillColor('#004d99').text('BRIDGEOF', { align: 'center' });
    doc.fontSize(12).fillColor('#333333').text('demo@gmail.com', { align: 'center' });
    doc.text('999949494939', { align: 'center' });
    doc.moveDown();

    // Bill Title
    doc.fontSize(25).fillColor('#004d99').text('Bill', { align: 'center' });
    doc.moveDown();

    // Draw Table Headers with Colors
    const startX = 50;
    const startY = 180;
    const headerHeight = 30;
    const rowHeight = 40; // Increased row height for more space
    const tableWidth = 600; // Increased table width

    // Header Background
    doc.rect(startX, startY, tableWidth, headerHeight).fill('#004d99');
    
    // Header Text
    doc.fontSize(14).fillColor('#ffffff')
        .text('Name', startX + 10, startY + 10)
        .text('Role', startX + 110, startY + 10)
        .text('Calculation', startX + 210, startY + 10)
        .text('Amount', startX + 360, startY + 10)
        .text('Currency', startX + 460, startY + 10)
        .text('Receipt', startX + 560, startY + 10);

    // Draw Table Borders
    doc.lineWidth(1).strokeColor('#004d99');
    doc.rect(startX, startY, tableWidth, headerHeight).stroke();

    // Draw Table Rows
    doc.fontSize(12).fillColor('#000000');

    // Calculation Breakdown
    doc.text(`Reviews: ${billDetails.notes.reviews} * 500`, startX + 210, startY + headerHeight + 15);

    // Table Row
    doc.text(billDetails.name, startX + 10, startY + headerHeight + 15)
       .text(billDetails.role, startX + 110, startY + headerHeight + 15)
       .text('', startX + 210, startY + headerHeight + 15) // Empty space for Calculation
       .text(billDetails.amount, startX + 360, startY + headerHeight + 15)
       .text(billDetails.currency, startX + 460, startY + headerHeight + 15)
       .text(billDetails.receipt, startX + 560, startY + headerHeight + 15);

    // Draw Bottom Border
    doc.rect(startX, startY + headerHeight + rowHeight, tableWidth, rowHeight).stroke();

    // Add Line Separators for Columns
    doc.moveTo(startX + 100, startY).lineTo(startX + 100, startY + headerHeight + rowHeight).stroke();
    doc.moveTo(startX + 200, startY).lineTo(startX + 200, startY + headerHeight + rowHeight).stroke();
    doc.moveTo(startX + 350, startY).lineTo(startX + 350, startY + headerHeight + rowHeight).stroke();
    doc.moveTo(startX + 450, startY).lineTo(startX + 450, startY + headerHeight + rowHeight).stroke();
    doc.moveTo(startX + 550, startY).lineTo(startX + 550, startY + headerHeight + rowHeight).stroke();

    doc.end();

    return filePath;
}

// Helper function to send email with the bill
async function sendEmailWithBill(userEmail, filePath) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mufeedmusthafanm@gmail.com',
            pass: 'qxkv bkbs kgip pxok',
        },
    });

    let mailOptions = {
        from: 'mufeedmusthafanm@gmail.com',
        to: userEmail,
        subject: 'Your Bill',
        text: 'Please find attached your bill for the recent transaction.',
        attachments: [
            {
                filename: 'bill.pdf',
                path: filePath,
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export const payment = async (req, res) => {
    const { paymentid } = req.params;
    const user = await Staff.findById(paymentid);

    if (!user) {
        return res.status(400).send('Reviewer not found');
    }

    const amount = 500 * user.count; // Amount calculation as per requirement
    const billDetails = {
        name: user.name,
        role: user.role,
        amount: amount, // amount in the smallest currency unit
        currency: 'INR',
        receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
        notes: {
            reviews: user.count,
            userid: paymentid,
        },
    };

    console.log(billDetails);

    // Generate PDF
    const filePath = generateBill(billDetails);

    // Send email with the bill
    await sendEmailWithBill(user.email, filePath);

    // Send the PDF for download
    res.download(filePath, 'bill.pdf', (err) => {
        if (err) {
            console.error('Error sending the PDF:', err);
            res.status(500).send('Error generating bill');
        } else {
            console.log('Bill sent for download');
        }
    });
};
