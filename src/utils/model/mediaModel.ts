import mongoose, { Document } from "mongoose";

interface Media extends Document {
    _id: object;
    type: string;
    link: string;
    title?: mongoose.Schema.Types.Mixed;
    description?: string;
    date?: Date;
}
const mediaModel = new mongoose.Schema<Media>(
    {
        _id: { type: mongoose.Types.ObjectId, required: true },
        type: { type: String, required: false },
        link: { type: String, required: false },
        title: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
            required: false,
        },
    },
    { versionKey: false }
);
export const Media =
    mongoose.models.media ||
    mongoose.model<Media>("media", mediaModel, "media");
