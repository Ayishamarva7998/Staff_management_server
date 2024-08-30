import cron from 'node-cron';
import { Staff } from '../models/staff.js';
import Booking from '../models/booking.js';
import Timeslot from '../models/timeslot.js';
import Notification from '../models/notification.js';
import Admin from '../models/Admin.js';
cron.schedule('*/5 * * * *', async () => {
    try {
        // Find all staff members with paymentStatus as true
        const staffMembers = await Staff.find({ paymentStatus: true });

        if (staffMembers && staffMembers.length > 0) {
            // Update each staff member's count to 0 and set paymentStatus to false
            for (const staff of staffMembers) {
                staff.count = 0;
                staff.paymentStatus = false;
                await staff.save();
                await Booking.updateMany({}, { is_deleted: true });
                await Timeslot.updateMany({}, { is_deleted: true });
            }
            console.log('Successfully cleared count and updated payment status for all relevant staff members.');
        } else {
            console.log('No staff members found with payment status set to true.');
        }


        const admin = await Admin.findOne();  // Assuming you have only one admin document
 
        const adminId = admin._id;
        const notification = new Notification({
            recipient: adminId,  // The reviewer who is booked
              // The advisor who made the booking
            type: 'warning',           // You can adjust the type as needed (e.g., 'info', 'success')
            message: ` give Salary to Reviewers `,
            targetGroup: 'individual',
          });
          
          await notification.save();
      
        //   res.status(200).json({ message: 'Review count updated successfully', notification });

console.log("notification send to admin");
    } catch (error) {
        console.error('Error clearing count and updating payment status:', error);
    }

  



});


cron.schedule('*/4 * * * *', async () => {
    try {
        // Update all notifications with status "read" to set `is_deleted` to true
        await Notification.updateMany({ status: "read" }, { is_deleted: true });

        // console.log("Notifications marked as deleted");
    } catch (error) {
        console.error("Error updating notifications:", error);
    }
});