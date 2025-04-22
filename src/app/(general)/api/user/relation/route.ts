import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const data  = await prisma.tutorStudent.findMany({include:{tutor:{select:{id:true, name: true, email: true}}, student: {select:{id:true, name: true, email: true}}}});
        return NextResponse.json({data, message: "Tutor-Student relations fetched", success: true})
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500});
    }
}

export async function POST(req: Request){
    try {
        const body = await req.json();

        const tutorExists = await prisma.user.findUnique({where: {role: "Tutor", id: body.tutor, userStatus: "Active"}, select:{id:true, name: true, email: true}});
        const studentExists = await prisma.user.findUnique({where: {role: "Student", id: body.student, userStatus: "Active"}, select:{id:true, name: true, email: true}});
        if(!tutorExists){
            return NextResponse.json({message: "Invalid Tutor", success: false},{status: 401})
        }
        if(!studentExists){
            return NextResponse.json({message: "Invalid Student", success: false},{status: 401})
        }
        const data = await prisma.tutorStudent.create({
            data: {
              tutorId: body.tutor,
              studentId: body.student,
              subject: body.subject
            }
          });
          
          return NextResponse.json({message: "Tutor-Student Relation Created", success: true, data: {...data, tutor: tutorExists, student: studentExists}});
        } catch (error) {
          console.log(error.message);
          return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500});
    }
}