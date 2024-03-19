import { connectDB } from "@/utils/db";
import { Blogs } from "@/utils/model/blogsModel";
import mongoose, { Document } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    content: any
): Promise<NextResponse> {
    await connectDB();
    const id = content.params.edit;
    const filter = { _id: id };
    try {
        const data = await Blogs.findById(filter);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}
