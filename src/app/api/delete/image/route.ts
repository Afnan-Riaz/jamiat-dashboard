import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from 'path';

export async function DELETE(req: any) {
    const { image } = req.body;
    if (!image) {
        return NextResponse.json({ message: "missing file name or type", success: false });
    }

    const cdnPath = path.join('/var/www/assets/images/', image);
    try {
        await unlink(cdnPath);
        return NextResponse.json({
            message: "file deleted",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({
            message: "file not found or could not be deleted",
            success: false,
        });
    }
}