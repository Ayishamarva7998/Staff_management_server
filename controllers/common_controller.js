import Admin from "../models/Admin.js";
import { Staff } from "../models/staff.js";

export const getIdfromData = async (req,res)=>{
    const {ID} = req.params;

    const admin = await Admin.findById(ID);
    if (admin) {
        return res.status(200).json({ ...admin.toObject(), role: 'admin' });
    }

    const staff = await Staff.findById(ID);
    if (staff) {
        return res.status(200).json({ ...staff.toObject() });
    }

    return res.status(404).json({ message: "Not found" });
}