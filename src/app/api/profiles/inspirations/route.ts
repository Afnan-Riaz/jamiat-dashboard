import { connectDB } from "@/utils/db";
import { Profiles } from "@/utils/model/profilesModel";
import mongoose, { Document } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    await connectDB();
    try {
        const data: Document[] = await Profiles.find({ type: 'inspiration' });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    let payload = await request.json();
    payload={type:"inspiration", ...payload};
    const filter={_id:payload._id}
    await connectDB();
    try {
        let result;
        const exist = await Profiles.findOne(filter);

        if (exist) {
            result = await Profiles.findOneAndReplace(filter, payload);
        } else {
            result = await Profiles.create(payload);
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
        const exist = await Profiles.findOne(filter);
        if(exist){
            result = await Profiles.deleteOne(filter);
            return NextResponse.json({ result, success: true });
        }
        throw Error("Object not found");
    } catch (error) {
        return NextResponse.json({ error, success: false });
    }
}
