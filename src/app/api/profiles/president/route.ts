import { connectDB } from "@/utils/db";
import { Profiles } from "@/utils/model/profilesModel";
import { Document } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    await connectDB();
    try {
        const data: Document<any, any, any>|null = await Profiles.findOne({ type: "president" });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    let payload = await request.json();
    payload = { type: "president", ...payload };
    const filter = { _id: payload._id };
    await connectDB();
    try {
        let result = await Profiles.findOneAndUpdate(filter, payload);
        return NextResponse.json({ result, success: true });
    } catch (error) {
        return NextResponse.json({ error, success: false });
    }
}
