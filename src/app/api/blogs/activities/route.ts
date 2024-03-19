import { connectDB } from "@/utils/db";
import { Blogs } from "@/utils/model/blogsModel";
import  { Document } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    await connectDB();
    try {
        const data: Document[] = await Blogs.find({ type: 'activity' });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    let payload = await request.json();
    payload={type:"activity", ...payload};
    const filter={_id:payload._id}
    await connectDB();
    try {
        let result;
        const exist = await Blogs.findOne(filter);

        if (exist) {
            result = await Blogs.findOneAndUpdate(filter, payload);
        } else {
            result = await Blogs.create(payload);
        }
        return NextResponse.json({ result, success: true });
    } catch (error) {
        return NextResponse.json({ error, success: false });
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    const payload = await request.json();
    const filter={_id:payload._id}
    await connectDB();
    try {
        let result;
        const exist = await Blogs.findOne(filter);
        if(exist){
            result = await Blogs.deleteOne(filter);
            return NextResponse.json({ result, success: true });
        }
        throw Error("Object not found");
    } catch (error) {
        return NextResponse.json({ error, success: false });
    }
}