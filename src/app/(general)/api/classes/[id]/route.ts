import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, {params}:{params: Promise<{id: string}>}){
    try {
        const {id} = await params;
        const body = await req.json();
        const classId = parseInt(id);
        
        await prisma.classSession.update({
            where: {
                id: classId
            }, 
            data: {
                ...body
            }
        })

        return NextResponse.json({message: "Updated class", success: true});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", success: false});
    }

}