import { connectDB } from "@/utils/db";
import { Blogs } from "@/utils/model/blogsModel";
import { NextResponse } from "next/server";


export async function GET(): Promise<NextResponse> {
    await connectDB();
    let data:any=[];
    try {
        data.push({ type:"Blogs",count:await Blogs.countDocuments({ type: 'blog' })});
        data.push({ type:"Activities",count:await Blogs.countDocuments({ type: 'activity' })});
        data.push({ type:"Events",count:await Blogs.countDocuments({ type: 'event' })});
        data.push({ type:"Projects",count:await Blogs.countDocuments({ type: 'project' })});
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}