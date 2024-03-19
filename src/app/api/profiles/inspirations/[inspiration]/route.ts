import { connectDB } from "@/utils/db";
import { Profiles } from "@/utils/model/profilesModel";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    content: any
): Promise<NextResponse> {
    await connectDB();
    const id = content.params.inspiration;
    const filter = { _id: id };
    try {
        const data = await Profiles.findById(filter);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}
