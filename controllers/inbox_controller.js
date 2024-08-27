// import Notification from "../models/notification";
// import Admin from "../models/Admin";

// export const adminInbox = async (req, res) => {
//   try {
//     const admin = await Admin.findOne();  // Assuming you have only one admin document
    
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
    
//     const adminId = admin._id;
//     const notifications = await Notification.find({ recipient: adminId });

//     console.log(notifications);

//     res.status(200).json({ message: "Notifications retrieved successfully", notifications });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
