import { writeFile } from "fs/promises"
import { NextApiRequest } from "next"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:any){
    const data=await req.formData();
    const file=data.get('file');
    if(!file){
        return NextResponse.json({"message":"no image found",success: false});
    }
    const byteData=await file.arrayBuffer();
    const buffer=Buffer.from(byteData);
    const path=`./public/${file.name}`;
    await writeFile(path,buffer);
    return NextResponse.json({"message":"file uploaded",success:true});
}