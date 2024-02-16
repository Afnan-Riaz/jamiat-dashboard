import mongoose, { Document } from "mongoose";

interface Blog extends Document {
    _id: object;
    type: string;
    meta_title?: string;
    meta_description?: string;
    title: string;
    canonical?: string;
    slug?: string;
    image: string;
    content: string;
    date?: Date;
}
const blogsModel = new mongoose.Schema<Blog>(
    {
        _id: { type: mongoose.Types.ObjectId, required: true },
        meta_title: {
            type: String,
            required: false,
        },
        meta_description: {
            type: String,
            required: false,
        },
        canonical: {
            type: String,
            required: false,
        },
        slug: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: false,
        },
    },
    { versionKey: false }
);
export const Blogs =
    mongoose.models.blogs || mongoose.model("blogs", blogsModel, "blogs");
