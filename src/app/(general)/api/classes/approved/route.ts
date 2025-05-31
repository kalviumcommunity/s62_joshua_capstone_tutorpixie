import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ClassSession } from "@prisma/client";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const userType = session.user.role as "User" | "Student" | "Tutor" | "Admin" | undefined;
        const userId = session.user.id;
        const currentDate = new Date();

        console.log(userType)

        let data: ClassSession[] = [];

        switch (userType) {
            case "Student":
                data = await prisma.classSession.findMany({
                    where: {
                        studentId: userId,
                        studentApprov: true,
                        tutorApprov: true,
                        endTime: {
                            gte: currentDate
                        }
                    }
                });
                break;

            case "Tutor":
                data = await prisma.classSession.findMany({
                    where: {
                        tutorId: userId,
                        studentApprov: true,
                        tutorApprov: true,
                        endTime: {
                            gte: currentDate
                        }
                    }
                });
                break;

            case "Admin":
                data = await prisma.classSession.findMany({
                    where: {
                        studentApprov: true,
                        tutorApprov: true,
                        endTime: {
                            gte: currentDate
                        }
                    }
                });
                break;

            case "User":
            default:
                return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
          
          return NextResponse.json(
            { message: "Classes fetched", success: true, data },
            { status: 200 }
          );
          
    } catch (error: any) {
        console.error("Fetch error:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}
