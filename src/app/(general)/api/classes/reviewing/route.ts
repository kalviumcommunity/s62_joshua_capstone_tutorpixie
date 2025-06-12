import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ClassSession } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        let data: ClassSession[] = [];
        if(!user) return NextResponse.json({message: "Unauthenticated, log in again", success: false}, {status: 403});

        switch(user.role){
            case "Tutor":
                data = await prisma.classSession.findMany({
                    where: {
                        tutorId: user.id,
                        status: "Reviewing"
                    }
                })
                break;
            case "Admin":
                data = await prisma.classSession.findMany({
                    where: {
                        status: "Reviewing"
                    }
                })
                break;
            case "User":
            case "Student":
            default:
                return NextResponse.json({message: "Unauthorized", success: false}, {status:403})
        }

        return NextResponse.json({message: "Review Sessions fetched", data, success: false});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"Internal Server Error", success: false}, {status: 500});
    }
}