import { connectDB, disconnectDB } from "@/utils/db";
import { Users } from "@/utils/model/usersModel";
import { Document } from "mongoose";
import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
    await connectDB();
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and Password is required" },
                { status: 401 }
            );
        }

        const user = await Users.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { message: "User does not exist" },
                { status: 400 }
            );
        }

        if (user.password != password) {
            return NextResponse.json(
                { message: "Incorrect Password" },
                { status: 400 }
            );
        }

        const tokenData = {
            username: user.username,
            id: user._id,
        };
        const role=user.role;
        const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY, {
            expiresIn: "1d",
        });

        const response = NextResponse.json(
            { message: "Login successfull" },{status:200});
        response.cookies.set("token", token, { httpOnly: true });
        response.cookies.set("role", role, { httpOnly: true });
        return response;
    } catch (error: any) {
        console.log("Error", error.message);
        return new Response("Something went wrong ", { status: 500 });
    }
};
export async function GET(): Promise<NextResponse> {
    const cookieStore:any=cookies();
    const role = cookieStore.get("role").value;
    if(role!="Admin"){
        return NextResponse.json({message:"You are not authorized to perform this action"},{status:401});
    }
    await connectDB();
    try {
        const data: Document[] = await Users.find();
        return NextResponse.json({message:data},{status:200});
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Internal Server Error");
    } finally {
        await disconnectDB();
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
    const payload = await request.json();
    const filter = { _id: payload._id };
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
    const filter = { _id: payload._id };
    await connectDB();
    try {
        let result;
        const exist = await Users.findOne(filter);
        if (exist) {
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
