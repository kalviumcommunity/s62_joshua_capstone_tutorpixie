import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, {params}: {params: Promise<{id: string}>}){
    const {id} = await params;
    const classId = parseInt(id);

    const session = await getServerSession(authOptions);
    if(!session?.user){
        return NextResponse.json({message:"invalid user", success: false}, {status: 401});
    }
    console.log(session?.user);
    const userType = session?.user?.role;

    const currClass = await prisma.classSession.findUnique({
        where:{
            id:classId
        }, 
        select: {
            studentApprov: true,
            tutorApprov: true,
        }
    })
    
    if (!currClass) {
        return NextResponse.json({message: "Class session not found", success: false}, {status: 404});
    }
    
    const currStudentApprov = currClass.studentApprov || false;
    const currTutorApprov = currClass.tutorApprov || false;

    try {
        console.log(userType);
        switch(userType){
            case 'Student':
                await prisma.classSession.update({
                    where: {
                        id: classId
                    },
                    data: {
                        studentApprov: true,
                        status: (currTutorApprov) ? "Confirmed" : "Pending",
                    }
                })
                break;
            case 'Tutor':
                await prisma.classSession.update({
                    where: {
                        id: classId
                    },
                    data: {
                        tutorApprov: true,
                        status: (currStudentApprov) ? "Confirmed" : "Pending",
                    }
                })
                break;
            case 'Admin':
                await prisma.classSession.update({
                    where: {
                        id: classId
                    },
                    data: {
                        tutorApprov: true,
                        studentApprov: true,
                        status: "Confirmed",
                    }
                })
                break;
            default:
                return NextResponse.json({message: "Invalid user role", success: false}, {status: 403});
        }
        return NextResponse.json({message: "session invite updated", success: true});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500});
    }
}