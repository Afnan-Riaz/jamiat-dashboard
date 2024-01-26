import mongoose, { Document } from "mongoose";

interface Page extends Document {
    _id: object;
    meta_title: string;
    meta_description: string;
    canonical: string;
    slug: string;
    page_title: string;
    content?: string;
}

const pageModel = new mongoose.Schema<Page>(
    {
        _id: { type: mongoose.Types.ObjectId, required: true },
        meta_title: { type: String, required: true },
        meta_description: { type: String, required: true },
        canonical: { type: String, required: true },
        slug: { type: String, required: true },
        page_title: { type: String, required: true },
        content: { type: String, required: false },
    },
    { versionKey: false }
);
export const Page =
    mongoose.models.page || mongoose.model<Page>("page", pageModel, "page");
