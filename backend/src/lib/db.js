import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const conn =  await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error connecting to db: ${error.message}`);
        process.exit(1); // exit the process with failure
    }
}

// MONGO_URI=mongodb+srv://devdwi:dbdevdwi@123@cluster0.kgez8az.mongodb.net/fit-band?retryWrites=true&w=majority&appName=Cluster0