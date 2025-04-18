import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        let classes;

        if(!session?.user){
            return NextResponse.json({message: "User not logged in", success: false});
        }

        if(session?.user?.role == "Student"){
            classes = await prisma.classSession.findMany({where: {studentId: session?.user?.id}});
        }else{
            classes = await prisma.classSession.findMany({where: {tutorId: session?.user?.id}});
        }
        console.log("Classes Fetched");
        return NextResponse.json({message: "Classes fetched", success: true, classes});
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({message: "Internal server error in fetching classes", success: false});
        
    }
}

export async function POST(req: Request){
    try {
        const {subject, tutorId, studentId, start, end} = await req.json();
        if(!subject || !tutorId || !studentId || !start || !end){
            return NextResponse.json({message: "Enter all necessary fields", success: false}, {status:401});
        }

        const tutorExists = await prisma.user.findUnique({where: {id: tutorId, role: "Tutor"}});
        const studentExists = await prisma.user.findUnique({where: {id: studentId, role: "Student"}});

        if(!studentExists){
            return NextResponse.json({message: "Student Not Found", success: false}, {status:401});
        }

        if(!tutorExists){
            return NextResponse.json({message: "Tutor Not Found", success: false}, {status:401});
        }

        const newClass = await prisma.classSession.create({
            data: { subject, tutorId, studentId, start, end }
        });

        return NextResponse.json({message:"Class created", success: true, newClass})
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({message: "Internal server error in creating classes", success: false}, {status:500});
    }
}