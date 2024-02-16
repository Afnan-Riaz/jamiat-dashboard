import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(req: any) {
    const data = await req.formData();
    const file = data.get("file");
    if (!file) {
        return NextResponse.json({ message: "no image found", success: false });
    }
    let fileFolder;
    if (file.type.startsWith('image/')) {
        fileFolder = 'images';
    } else if (file.type.startsWith('audio/')) {
        fileFolder = 'audio';
    } else if (file.type.startsWith('video/')) {
        fileFolder = 'videos';
    } else {
        return NextResponse.json({ message: "unsupported file type", success: false });
    }
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/${fileFolder}/${file.name}`;
    await writeFile(path, buffer);

    const location = `/${fileFolder}/${file.name}`;
    return NextResponse.json({
        location: location,
        message: "file uploaded",
        success: true,
    });
}
