import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const session = await getServerSession(authOptions);
        let data;

        if(!session?.user){
            return NextResponse.json({message: "Unauthorized", success: false}, {status: 401});
        }
        const userType = session?.user?.role;
        const userId = session?.user?.id;
        if(userType=="User"){
            return NextResponse.json({message: "Unauthorized", success: false}, {status: 401});
        }else if(userType=="Student"){
            data = await prisma.classSession.findMany({where: {studentId: userId, studentApprov: false}});
        }else if(userType=="Tutor"){
            data = await prisma.classSession.findMany({where: {tutorId: userId, tutorApprov: false}});
        }else if(userType=="Admin"){
            data = await prisma.classSession.findMany({where: {OR:[{studentApprov: false}, {tutorApprov: false}]}});
        }
        return NextResponse.json({message: "Classes fetched", success: true, data})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", success: false}, {status: 500})
    }
}