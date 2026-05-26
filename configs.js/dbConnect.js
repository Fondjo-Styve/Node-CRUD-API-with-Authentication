import mongoose from 'mongoose';
import 'dotenv/config';
const MONGODB_URL=process.env.MONGODB_URL;
export const dbConnect=async ()=>{
    try {
        await mongoose.connect(MONGODB_URL)
        console.log('database connected');
    } catch (error) {
        console.error(`database connection error ${error}`);
    }
}