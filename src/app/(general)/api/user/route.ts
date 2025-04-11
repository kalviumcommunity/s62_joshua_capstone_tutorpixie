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

export async function DELETE(req: Request){
    try {
        const body = await req.json();
        const id = body.id;
        if(!id){
            return NextResponse.json({message: "Id not present", success: false}, {status: 401})
        }
        await prisma.user.delete({where: {id:parseInt(id)}})
        return NextResponse.json({message: "User deleted", success: true}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", success: false, error});
    }
}