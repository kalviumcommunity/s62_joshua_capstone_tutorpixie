import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {email, password} = await req.json();
        if(!email || !password){
            return NextResponse.json({message: "Email and password are required", success: false}, {status: 400});
        }

        const userExists = await prisma.user.findUnique({where: {email}});
        if(!userExists){
            return NextResponse.json({message: "user not found", success: false}, {status: 409})
        }

        return NextResponse.json({message: 'User Login Successfull', success: true}, {status: 400});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Internal Server Error", success: false});
    }
}