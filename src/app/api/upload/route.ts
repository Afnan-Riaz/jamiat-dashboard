import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from 'path';

export async function POST(req: any) {
    const data = await req.formData();
    const file = data.get("file");
    if (!file) {
        return NextResponse.json({ message: "no image found", success: false });
    }
    let fileFolder;
    if (file.type.startsWith('image/')) {
        fileFolder = '/images/';
    } else if (file.type.startsWith('audio/')) {
        fileFolder = '/audio/';
    } else if (file.type.startsWith('video/')) {
        fileFolder = '/videos/';
    } else {
        return NextResponse.json({ message: "unsupported file type", success: false });
    }
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);

    const cdnPath = path.join('/var/www/assets', fileFolder, file.name);
    await writeFile(cdnPath, buffer);

    const location = `https://cdn.jamiat.org.pk${fileFolder}${file.name}`;
    return NextResponse.json({
        location: location,
        message: "file uploaded",
        success: true,
    });
}
