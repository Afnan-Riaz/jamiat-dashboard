import { connectionStr } from "@/utils/db";
import { Page } from "@/utils/model/pageModel";
import mongoose, { Document } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    await mongoose.connect(connectionStr);
    try {
        const data: Document[] = await Page.find();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    } finally {
        mongoose.disconnect();
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    const payload = await request.json();
    const filter={_id:payload._id}
    await mongoose.connect(connectionStr);
    try {
        let result;
        const exist = await Page.findOne(filter);

        if (exist) {
            result = await Page.findOneAndUpdate(filter, payload);
        } else {
            result = await Page.create(payload);
        }
        return NextResponse.json({ result, success: true });
    } catch (error) {
        return NextResponse.json({ error, success: false });
    } finally {
        mongoose.disconnect();
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    const payload = await request.json();
    const filter={_id:payload._id}
    await mongoose.connect(connectionStr);
    try {
        let result;
        const exist = await Page.findOne(filter);
        if(exist){
            result = await Page.deleteOne(filter);
            return NextResponse.json({ result, success: true });
        }
        throw Error("Object not found");
    } catch (error) {
        return NextResponse.json({ error, success: false });
    } finally {
        mongoose.disconnect();
    }
}
