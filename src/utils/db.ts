import mongoose from "mongoose";
const { USER_NAME, PASSWORD } = process.env;
const connectionStr: string = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.ovilnum.mongodb.net/Jamiat?retryWrites=true&w=majority`;

const connection = {isConnected:0}

const connectDB = async () => {
    if (connection.isConnected){
        return;
    }
    const db = await mongoose.
        connect(connectionStr)

    connection.isConnected = db.connections[0].readyState
}

export { connectDB};
