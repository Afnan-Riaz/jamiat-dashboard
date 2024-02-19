import mongoose, { Document } from "mongoose";

interface Profile extends Document {
    _id: object;
    type: string;
    meta_title?: string;
    meta_description?: string;
    canonical?: string;
    slug?: string;
    name: string;
    image: mongoose.Schema.Types.Mixed;
    designation: string;
    content: string;
    dob?: Date;
    dod?: Date;
}

const profilesModel = new mongoose.Schema<Profile>(
    {
        _id: { type: mongoose.Types.ObjectId, required: true },
        type: String,
        meta_title: { type: String, required: false },
        meta_description: { type: String, required: false },
        canonical: { type: String, required: false },
        slug: { type: String, required: false },
        name: { type: String, required: true },
        image: { type: String, required: true },
        designation: { type: String, required: true },
        content: { type: String, required: true },
        dob: { type: Date, required: false },
        dod: { type: Date, required: false },
    },
    { versionKey: false }
);

export const Profiles =
    mongoose.models.profiles ||
    mongoose.model<Profile>("profiles", profilesModel, "profiles");
