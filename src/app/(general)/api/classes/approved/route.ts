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
        const userId = parseInt(session.user.id);
        const currentDate = new Date();

        console.log(userType);

        let data: ClassSession[] = [];

        // Move any sessions that are over to reviewing
        await prisma.$executeRaw`
            UPDATE "ClassSession"
            SET status = 'Reviewing'
            WHERE status = 'Confirmed'
            AND (startTime + (duration || ' hours')::interval) < ${currentDate}
        `;

        switch (userType) {
            case "Student":
                data = await prisma.classSession.findMany({
                    where: {
                        studentId: userId,
                        studentApprov: true,
                        tutorApprov: true,
                        status: "Confirmed",
                        // Filter where current time is less than (startTime + duration in milliseconds)
                        startTime: {
                            gte: new Date(currentDate.getTime() - (24 * 60 * 60 * 1000)) // Allow sessions from last 24 hours to account for duration
                        }
                    },
                    orderBy: {
                        startTime: 'asc'
                    }
                });
                break;

            case "Tutor":
                data = await prisma.classSession.findMany({
                    where: {
                        tutorId: userId,
                        studentApprov: true,
                        tutorApprov: true,
                        status: "Confirmed",
                        startTime: {
                            gte: new Date(currentDate.getTime() - (24 * 60 * 60 * 1000))
                        }
                    },
                    orderBy: {
                        startTime: 'asc'
                    }
                });
                break;

            case "Admin":
                data = await prisma.classSession.findMany({
                    where: {
                        studentApprov: true,
                        tutorApprov: true,
                        status: "Confirmed",
                        startTime: {
                            gte: new Date(currentDate.getTime() - (24 * 60 * 60 * 1000))
                        }
                    },
                    orderBy: {
                        startTime: 'asc'
                    }
                });
                break;

            case "User":
            default:
                return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        // Filter sessions that haven't ended yet (current time < startTime + duration)
        const activeSessions = data.filter(session => {
            const endTime = new Date(session.startTime.getTime() + ((session.duration + 0.1) * 60 * 60 * 1000));
            return currentDate < endTime;
        });

        return NextResponse.json(
            { message: "Active classes fetched", success: true, data: activeSessions },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Fetch error:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}