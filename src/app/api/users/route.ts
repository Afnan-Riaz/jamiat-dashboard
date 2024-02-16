import { connectDB, disconnectDB } from "@/utils/db";
import { Users } from "@/utils/model/usersModel";
import mongoose, { Document } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    await connectDB();
    try {
        const data: Document[] = await Users.find();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    } finally {
        await disconnectDB();
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    const payload = await request.json();
    const filter={_id:payload._id}
    await connectDB();
    try {
        let result;
        const exist = await Users.findOne(filter);

        if (exist) {
            result = await Users.findOneAndUpdate(filter, payload);
        } else {
            result = await Users.create(payload);
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
        const exist = await Users.findOne(filter);
        if(exist){
            result = await Users.deleteOne(filter);
            return NextResponse.json({ result, success: true });
        }
        throw Error("Object not found");
    } catch (error) {
        return NextResponse.json({ error, success: false });
    } finally {
        await disconnectDB();
    }
}
