import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, {params}: {params: Promise<{id: string}>}){
    try {
        const {id} = await params;
        const relationId = parseInt(id);

        await prisma.tutorStudent.delete({where: {id: relationId}})
        return NextResponse.json({message: "Relation deleted", success: true})
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500});
    }
}