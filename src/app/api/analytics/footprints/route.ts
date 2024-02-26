import { connectDB, disconnectDB } from "@/utils/db";
import { Analytics } from "@/utils/model/analyticsModel";
import { Document } from "mongoose";
import { NextResponse } from "next/server";
export async function GET(): Promise<NextResponse> {
    await connectDB();
    try {
        const data: Document[] = await Analytics.find({ type: 'footprints' });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    } finally {
        // await disconnectDB();
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    let payload = await request.json();
    payload={type:"footprints", ...payload};
    const filter={_id:payload._id}
    await connectDB();
    try {
        let result;
        const exist = await Analytics.findOne(filter);

        if (exist) {
            result = await Analytics.findOneAndUpdate(filter, payload);
        } else {
            result = await Analytics.create(payload);
        }
        return NextResponse.json({ result, success: true });
    } catch (error) {
        return NextResponse.json({ error, success: false });
    } finally {
        await disconnectDB();
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    const payload = await request.json();
    const filter={_id:payload._id}
    await connectDB();
    try {
        let result;
        const exist = await Analytics.findOne(filter);
        if(exist){
            result = await Analytics.deleteOne(filter);
            return NextResponse.json({ result, success: true });
        }
        throw Error("Object not found");
    } catch (error) {
        return NextResponse.json({ error, success: false });
    } finally {
        await disconnectDB();
    }
}