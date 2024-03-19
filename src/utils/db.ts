import mongoose from "mongoose";
const { user, password } = process.env;
const connectionStr: string = `mongodb+srv://${user}:${password}@cluster0.ovilnum.mongodb.net/Jamiat?retryWrites=true&w=majority`;

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
