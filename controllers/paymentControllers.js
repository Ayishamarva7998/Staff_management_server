import { Staff, Reviewer, Mentor } from '../models/staff.js';

export const payment = async (req, res) => {
   
        const id = req.params.id;
        const user = await Staff.findById(id)
        console.log(user);
        // .populate({
        //             path: "cart",
        //             populate:{path:"productid"}
        //         });
// console.log(user.cart);
//         if (!user || user.cart.length === 0) {
//             return res.status(400).send('Cart is empty or user not found');
//         }
//         const amount = user.cart.reduce((total, item) => {
//             return total += item.productid.price * item.quantity; 
//         }, 0);
//         const productNames = user.cart.map(item => item.productid.title).join(', ');
//         // console.log(productNames);
//             // Assuming each cart item has a quantity and productid has a price
// console.log(amount);
//         const options = {
//             amount: amount*100, // amount in the smallest currency unit
//             currency: 'INR',
//             receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
//             notes:{
//                 product : productNames,
//                 userid : id
//             }
            
//         };

//         const order = await razorpay.orders.create(options);
//         res.json(order);
        
//         console.log(order);
}