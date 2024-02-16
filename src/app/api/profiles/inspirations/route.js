import { connectDB, disconnectDB } from "@/utils/db";
import { Profiles } from "@/utils/model/profilesModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDB();
    const data=await Profiles.find({ type: 'inspiration' });
    return NextResponse.json(data);
}