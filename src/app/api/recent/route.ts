import { connectDB } from "@/utils/db";
import { Blogs } from "@/utils/model/blogsModel";
import { NextResponse } from "next/server";

const parseDate = (date: any) => {
    const parsedDate = date.getTimestamp().toISOString().substring(0, 10);
    return parsedDate;
};

export async function GET(): Promise<NextResponse> {
    await connectDB();
    let data: any = [];
    try {
        data.push({
            type: "Blog",
            date: await Blogs.findOne({ type: "blog" })
                .sort({ _id: -1 })
                .then((blog) => parseDate(blog._id)),
        });
        data.push({
            type: "Activity",
            date: await Blogs.findOne({ type: "activity" })
                .sort({ _id: -1 })
                .then((blog) => parseDate(blog._id)),
        });
        data.push({
            type: "Event",
            date: await Blogs.findOne({ type: "event" })
                .sort({ _id: -1 })
                .then((blog) => parseDate(blog._id)),
        });
        data.push({
            type: "Project",
            date: await Blogs.findOne({ type: "project" })
                .sort({ _id: -1 })
                .then((blog) => parseDate(blog._id)),
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}
