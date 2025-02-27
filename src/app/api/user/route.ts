import { NextResponse } from "next/server";
import {prisma} from '@/lib/db'

export async function GET(){
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json({message: "Users fetched", data:users, success: true})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", success: false})
    }
}

export async function POST(req: Request) {
    try {
        const {email, password} = await req.json();
        if(!email || !password){
            return NextResponse.json({message: "Email and password are required", success: false}, {status: 400});
        }

        const userExists = await prisma.user.findUnique({where: {email}});
        if(userExists){
            return NextResponse.json({message: "user already exists"})
        }

        const user = await prisma.user.create({data: {email: email, password: password},});

        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", success: false});
    }
}