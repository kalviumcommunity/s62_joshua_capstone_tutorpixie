import { NextResponse } from "next/server";
import {prisma} from '@/lib/db'
import bcrypt from 'bcrypt'

export async function GET(){
    try {
        const users = await prisma.user.findMany()

        if (!users || users.length === 0) {
            return NextResponse.json({
                message: "No users found",
                data: [],
                success: true, 
            });
        }

        return NextResponse.json({message: "Users fetched", data:users, success: true})
    } catch (error) {
        console.error(error)
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
            return NextResponse.json({message: "user already exists", success: false}, {status: 409})
        }

        const hashPassword = await bcrypt.hash(password, 10);
        if(!hashPassword){
            return NextResponse.json({message: "error in hashing password", success: false}, {status: 400});
        }

        const user = await prisma.user.create({data: {email: email, password: hashPassword},});

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Internal Server Error", success: false});
    }
}

export async function PUT(req: Request){
    try {
        const body = await req.json();
        const user = await prisma.user.update({where: {id: body.id}, data: {...body}});
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", success: false});
    }
}