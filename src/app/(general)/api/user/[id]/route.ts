import { NextResponse } from "next/server";
import {prisma} from '@/lib/db'

export async function PUT(req: Request, {params}:{params: Promise<{ id: string }>}){
    try {
        const body = await req.json();
        const {id} =  await params;
        const userId = parseInt(id);
        if(!userId){
            return NextResponse.json({message: "Id not present", success: false}, {status: 401})
        }
        const user = await prisma.user.update({where: {id: userId}, data: {...body}});
        return NextResponse.json({message: "user Updated", user, success: true});
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error", success: false, error});
    }
}

export async function DELETE(req: Request, {params}:{params: Promise<{id: string}>}){
    try {
        const {id} = await params;
        if(!id){
            return NextResponse.json({message: "Id not present", success: false}, {status: 401})
        }
        await prisma.user.update({where: {id:parseInt(id)}, data: {userStatus: "Discontinued"}})
        return NextResponse.json({message: "User deleted", success: true}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", success: false, error});
    }
}