import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ClassSession } from "@prisma/client";

export async function GET() {
    try {
        console.log("Starting API request...");
        
        // Check session
        const session = await getServerSession(authOptions);
        console.log("Session:", session ? "exists" : "null");

        if (!session?.user) {
            console.log("No session or user found");
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const userType = session.user.role as "User" | "Student" | "Tutor" | "Admin" | undefined;
        const userId = session.user.id;
        const currentDate = new Date();
        
        console.log("User type:", userType);
        console.log("User ID:", userId);
        console.log("Current date:", currentDate);

        let data: ClassSession[] = [];

        // Delete completed sessions - with better error handling
        try {
            console.log("Attempting to delete completed sessions...");
            const deleteResult = await prisma.classSession.deleteMany({
                where: {
                    studentApprov: true,
                    tutorApprov: true,
                    // Calculate end time from startTime + duration (in hours)
                    startTime: {
                        lt: new Date(currentDate.getTime() - (24 * 60 * 60 * 1000)) // Sessions older than 24 hours
                    }
                }
            });
            console.log("Deleted sessions count:", deleteResult.count);
        } catch (deleteError) {
            console.error("Error deleting completed sessions:", deleteError || "Unknown delete error");
            // Continue execution even if delete fails
        }

        // Fetch data based on user type
        switch (userType) {
            case "Student":
                console.log("Fetching data for Student...");
                try {
                    data = await prisma.classSession.findMany({
                        where: {
                            studentId: userId,
                            studentApprov: false,
                            // Only get future sessions
                            startTime: {
                                gte: currentDate
                            }
                        }
                    });
                } catch (fetchError) {
                    console.error("Error fetching student data:", fetchError || "Unknown error");
                    throw fetchError || new Error("Unknown database error occurred");
                }
                break;

            case "Tutor":
                console.log("Fetching data for Tutor...");
                try {
                    data = await prisma.classSession.findMany({
                        where: {
                            tutorId: userId,
                            tutorApprov: false,
                            // Only get future sessions
                            startTime: {
                                gte: currentDate
                            }
                        }
                    });
                } catch (fetchError) {
                    console.error("Error fetching tutor data:", fetchError || "Unknown error");
                    throw fetchError || new Error("Unknown database error occurred");
                }
                break;

            case "Admin":
                console.log("Fetching data for Admin...");
                try {
                    data = await prisma.classSession.findMany({
                        where: {
                            // Only get future sessions
                            startTime: {
                                gte: currentDate
                            },
                            OR: [
                                { studentApprov: false },
                                { tutorApprov: false }
                            ]
                        }
                    });
                } catch (fetchError) {
                    console.error("Error fetching admin data:", fetchError);
                    throw fetchError;
                }
                break;

            case "User":
            default:
                console.log("Unauthorized user type:", userType);
                return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        console.log("Data fetched successfully, count:", data.length);
        
        return NextResponse.json(
            { message: "Class Invites fetched", success: true, data },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("API Error Details:");
        console.error("Error message:", error?.message || "No error message");
        console.error("Error stack:", error?.stack || "No stack trace");
        console.error("Error type:", typeof error);
        console.error("Full error object:", error || "Error is null/undefined");
        
        return NextResponse.json(
            { 
                message: "Internal Server Error", 
                success: false,
                // Include error details in development
                ...(process.env.NODE_ENV === 'development' && { 
                    error: error?.message || "Unknown error",
                    stack: error?.stack || "No stack trace"
                })
            }, 
            { status: 500 }
        );
    }
}