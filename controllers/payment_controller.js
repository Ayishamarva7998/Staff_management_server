"use strict";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { Staff } from '../models/staff.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Paymenthistory from '../models/payment.js';
import Booking from "../models/booking.js";

// Create Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.Razorpay_key_Id,
    key_secret: process.env.Razorpay_key_secret,
});

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const payment = async (req, res) => {
 
        let { paymentid } = req.params;

        // Trim the paymentid to remove any extraneous whitespace or newline characters
        paymentid = paymentid.trim();

        // Validate if paymentid is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(paymentid)) {
            return res.status(400).json({ error: 'Invalid payment ID' });
        }

        const user = await Staff.findById(paymentid);

        if (!user) {
            return res.status(404).json({ error: 'Reviewer not found' });
        }

        const amount = user.hire * user.count; // Amount calculation as per requirement

        // Define billDetails here
        const billDetails = {
            amount: amount*100, // amount in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
            notes: {
                reviews: user.count,
                userid: paymentid,
            },
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(billDetails);

        // Send response with order details
        res.status(200).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });

   
};
export const verifyPayment = async (req, res) => {

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        // Generate the signature for comparison
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const order = await razorpay.orders.fetch(razorpay_order_id);

        // Verify the signature
        if (generatedSignature === razorpay_signature) {
            // Payment is verified
            // Update the staff record
            const staff = await Staff.findById(order.notes.userid);
            staff.paymentStatus = true;
           
            await staff.save();
            const paymentHistory = new Paymenthistory({
                reviewerId: order.notes.userid,
                amount: order.amount / 100, // Assuming amount is in paise, convert to rupees
                paymentStatus: true,
              });
              await paymentHistory.save();

            // Generate PDF bill
            const doc = new PDFDocument();
            const pdfPath = path.join(__dirname, `bill_${staff._id}.pdf`);
            
            doc.pipe(fs.createWriteStream(pdfPath));

            // Add company name and styling
            doc.fontSize(30).fillColor('navy').text('Bridgeon', { align: 'center' });
            doc.moveDown();

            // Add bill title with some spacing
            doc.fontSize(24).fillColor('black').text('Payment Bill', { align: 'center' });
            doc.moveDown();
            doc.moveDown();

            // Draw table headers with padding and bold font
            doc.fontSize(12).font('Helvetica-Bold');
            doc.fillColor('gray').rect(50, 200, 500, 20).fill();
            doc.fillColor('white').text('Description', 55, 205);
            doc.text('Details', 355, 205);

            // Draw table rows with more padding
            const tableYStart = 220;
            const rowHeight = 30;
            const rowData = [
                { description: 'Name:', details: `${staff.name }` },
                { description: 'Payment Amount:', details: `${staff.count *500}` },
                { description: 'Date:', details: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { description: 'Reviews Count:', details: staff.count },
                { description: 'Account', details: 'Bridgeon Admin' },
            ];

            rowData.forEach((row, index) => {
                const rowY = tableYStart + (index * rowHeight);
                doc.fillColor(index % 2 === 0 ? 'lightgray' : 'white').rect(50, rowY, 500, rowHeight).fill();
                doc.fillColor('black').font('Helvetica').text(row.description, 55, rowY + 10);
                doc.text(row.details, 355, rowY + 10);
            });

            doc.end();

            // Send email with PDF attachment
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: staff.email, // Ensure staff has an email field
                subject: 'Your Payment Bill from Bridgeon Pvt',
                text: 'Please find attached the bill for your recent payment.',
                attachments: [
                    {
                        filename: `bill_${staff._id}.pdf`,
                        path: pdfPath,
                    },
                ],
            };

            await transporter.sendMail(mailOptions);

            // Clean up the PDF file after sending the email
            fs.unlink(pdfPath, (err) => {
                if (err) console.error('Error deleting the file', err);
            });

            // Respond to client
            res.status(200).json({ message: 'Payment verified successfully and email sent' });
        } else {
            res.status(400).json({ error: 'Payment verification failed' });
        }
   
};




export const paymentHistory = async (req, res) => {
   
        const {id}=req.params;
        const payment_history = await Paymenthistory.find({reviewerId:id})
      
        if(!payment_history){
            return res.status(404).json({ message: 'No payment history found' });
        }
        
        if (payment_history.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(payment_history);
};


export const total_review_detsils = async (req,res)=>{

     const paymentcompletecount  = await Paymenthistory.countDocuments();
     
     const incompletecount = await Booking.countDocuments({
        reviewer_accepted: false,        
        advisor_accepted: false
    });

     const completecount = await Booking.countDocuments({
        reviewer_accepted: true,        
        advisor_accepted: true
    });

    const pendingcount = await Booking.countDocuments({
        reviewer_accepted: true,
        advisor_accepted: false
    });

    const totalcount = await Booking.countDocuments();

    if (paymentcompletecount === 0) {
        return res.status(200).json({
            message: 'No payment history found.',
            paymentcompletecount: 0,
            incompletecount,
            pendingcount,
            totalcount,
            completecount
        });
    }


    return res.status(200).json({
        paymentcompletecount,
        incompletecount,
        pendingcount,
        totalcount,
        completecount
    });
    
}