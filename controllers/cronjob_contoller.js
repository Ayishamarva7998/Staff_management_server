import cron from 'node-cron';
import { Staff } from '../models/staff.js';
import Booking from '../models/booking.js';
import Timeslot from '../models/timeslot.js';
cron.schedule('*/10 * * * *', async () => {
    try {
        // Find all staff members with paymentStatus as true
        const staffMembers = await Staff.find({ paymentStatus: true });

        if (staffMembers && staffMembers.length > 0) {
            // Update each staff member's count to 0 and set paymentStatus to false
            for (const staff of staffMembers) {
                staff.count = 0;
                staff.paymentStatus = false;
                await staff.save();
                await Booking.deleteMany()
                await Timeslot.deleteMany()
            }
            console.log('Successfully cleared count and updated payment status for all relevant staff members.');
        } else {
            console.log('No staff members found with payment status set to true.');
        }
    } catch (error) {
        console.error('Error clearing count and updating payment status:', error);
    }
});