import mongoose from "mongoose";
const { user, password } = process.env;
const connectionStr: string = `mongodb+srv://${user}:${password}@cluster0.ovilnum.mongodb.net/Jamiat?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(connectionStr);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
    }
};
export { connectDB, disconnectDB };
