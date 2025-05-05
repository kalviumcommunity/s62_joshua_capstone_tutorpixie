import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const {id} = await params;
        const tutorId = parseInt(id);
        const data  = await prisma.tutorStudent.findMany({where: {tutorId}, include:{tutor:{select:{id:true, name: true, email: true}}, student: {select:{id:true, name: true, email: true}}}});
        const students = data.map((tutor)=>(tutor.student));
        return NextResponse.json({data, students, message: "Tutor-Student relations fetched", success: true})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500});
    }
}