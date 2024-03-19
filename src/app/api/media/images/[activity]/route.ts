import { connectDB } from "@/utils/db";
import { Media } from "@/utils/model/mediaModel";
import { NextResponse } from "next/server";
export async function GET(
    request: Request,
    content: any
): Promise<NextResponse> {
    await connectDB();
    const id = content.params.activity;
    try {
        const data = await Media.find({ title: id });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}

export async function PUT(
    request: Request,
    content: any
): Promise<NextResponse> {
    let payload = await request.json();
    let id = content.params.activity;
    payload = { type: "activity", ...payload, title: id };
    const filter = { _id: payload._id };
    await connectDB();
    try {
        let result;
        const exist = await Media.findOne(filter);

        if (exist) {
            result = await Media.findOneAndUpdate(filter, payload);
        } else {
            result = await Media.create(payload);
        }
        return NextResponse.json({ result, success: true });
    } catch (error) {
        return NextResponse.json({ error, success: false });
    }
}
