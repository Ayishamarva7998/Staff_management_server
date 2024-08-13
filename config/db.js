import mongoose from "mongoose";

const connectDB =async ()=>{
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log('Mongo DB error',error));
};
export default connectDB