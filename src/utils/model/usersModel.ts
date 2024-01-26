import mongoose, { Document } from "mongoose";

interface User extends Document {
    _id: object;
    name: string;
    username: string;
    password: string;
    role: string;
}

const usersModel = new mongoose.Schema<User>(
    {
        _id: { type: mongoose.Types.ObjectId, required: true },
        name: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
    },
    { versionKey: false }
);

export const Users = mongoose.models.users || mongoose.model<User>("users", usersModel, "users");
