import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    console.log("Signup called")
    try {
        const body = await req.json();
        console.log(body);
        if(!body.email || !body.password){
            return NextResponse.json({message: "Email and password are required", success: false}, {status: 400});
        }

        const userExists = await prisma.user.findUnique({where: {email: body.email}});
        if(userExists){
            return NextResponse.json({message: "user already exists", success: false}, {status: 409})
        }

        const hashPassword = await bcrypt.hash(body.password, 10);
        if(!hashPassword){
            return NextResponse.json({message: "error in hashing password", success: false}, {status: 400});
        }

        const user = await prisma.user.create({data: {...body, password: hashPassword}});

        return NextResponse.json({message: "user created", success: true, user});
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500});
    }
}