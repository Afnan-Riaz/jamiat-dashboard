import mongoose, { Document } from "mongoose";

interface Analytics extends Document {
    _id: object;
    type: string;
    title: string;
    count: mongoose.Schema.Types.Mixed;
}
const analyticsModel = new mongoose.Schema<Analytics>(
    {
        _id: { type: mongoose.Types.ObjectId, required: true },
        type: { type: String, required: true },
        title: { type: String, required: true },
        count: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { versionKey: false }
);
export const Analytics =
    mongoose.models.analytics ||
    mongoose.model<Analytics>("analytics", analyticsModel, "analytics");
