import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const {id} = await params;
        const studentId = parseInt(id);
        const data  = await prisma.tutorStudent.findMany({where: {studentId}, include:{tutor:{select:{id:true, name: true, email: true}}, student: {select:{id:true, name: true, email: true}}}});
        return NextResponse.json({data, message: "Tutor-Student relations fetched", success: true})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500});
    }
}