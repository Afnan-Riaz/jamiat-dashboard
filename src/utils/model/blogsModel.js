import mongoose from "mongoose";

const blogsModel=new mongoose.Schema({
    meta_title: {
        type: String,
        required: false
    },
    meta_description: {
        type: String,
        required: false
    },
    canonical: {
        type: String,
        required: false
    },
    slug:{
        type: String,
        required: false
    },
    type:String,
    title:String,
    image:String,
    content:String,
    date:{
        type: Date,
        required: false
    }
},{versionKey:false});
export const Blogs = mongoose.models.blogs || mongoose.model("blogs",blogsModel,"blogs");