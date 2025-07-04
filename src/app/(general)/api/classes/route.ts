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
        const userType=session?.user?.role;
        // const userType="Admin";

        if(userType == "Student"){
            classes = await prisma.classSession.findMany({where: {studentId: session?.user?.id}});
        }else if(userType=="Tutor"){
            classes = await prisma.classSession.findMany({where: {tutorId: session?.user?.id}});
        }else if(userType=="Admin"){
            classes = await prisma.classSession.findMany();
        }else if(userType=="User"){
            return NextResponse.json({message:"Unauthorized", success: false}, {status: 401});
        }
        return NextResponse.json({message: "Classes fetched", success: true, classes});
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({message: "Internal server error in fetching classes", success: false});
        
    }
}

export async function POST(req: Request){
    try {
        const body = await req.json();
        const {
            subject, 
            tutorId, 
            studentId, 
            startTime, 
            duration, 
            meetlink, 
            repeating, 
            repeatingDay, 
            status
        } = body;
        
        // Validate required fields
        if(!subject || !tutorId || !studentId || !startTime || !duration){
            return NextResponse.json({
                message: "Enter all necessary fields", 
                success: false
            }, {status: 401});
        }
        
        // Convert string dates to Date objects if they're not already
        const parsedStartTime = new Date(startTime);
        
        // Validate the users exist with correct roles
        const tutorExists = await prisma.user.findUnique({
            where: {id: tutorId, role: "Tutor"}
        });
        
        const studentExists = await prisma.user.findUnique({
            where: {id: studentId, role: "Student"}
        });
        
        if(!studentExists){
            return NextResponse.json({
                message: "Student Not Found", 
                success: false
            }, {status: 401});
        }
        
        if(!tutorExists){
            return NextResponse.json({
                message: "Tutor Not Found", 
                success: false
            }, {status: 401});
        }
        
        // Create the class session with explicit field mapping
        const newClass = await prisma.classSession.create({
            data: {
                subject,
                tutorId,
                studentId,
                duration,
                startTime: parsedStartTime,
                meetlink: meetlink || null,
                repeating: repeating || false,
                repeatingDay: repeatingDay || null,
                status: status || "Pending"
            }
        });
        
        return NextResponse.json({
            message: "Class created", 
            success: true, 
            newClass
        });
    } catch (error) {
        console.log(error.message);
        
        // Provide more specific error messages when possible
        if (error.code === 'P2002') {
            return NextResponse.json({
                message: "Scheduling conflict: This time slot is already booked", 
                success: false
            }, {status: 409});
        }
        
        return NextResponse.json({
            message: "Internal server error in creating classes", 
            success: false
        }, {status: 500});
    }
}

export async function DELETE(req: Request){
    try {
        await prisma.classSession.deleteMany({});
        return NextResponse.json({message:"deleted"})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "unable to delete"}, {status: 500})
    }
}