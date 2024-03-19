import { connectDB } from "@/utils/db";
import { Page } from "@/utils/model/pageModel";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    content: any
): Promise<NextResponse> {
    await connectDB();
    const id = content.params.page;
    const filter = { _id: id };
    try {
        const data = await Page.findById(filter);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    }
}
