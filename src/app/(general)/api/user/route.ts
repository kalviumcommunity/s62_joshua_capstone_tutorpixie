import { NextResponse } from "next/server";
import {prisma} from '@/lib/db'

export async function GET(){
    try {
        const users = await prisma.user.findMany()
        console.log("users", users);

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