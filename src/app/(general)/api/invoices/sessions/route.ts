import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    // gets the sessions that have currently not billed for the particular user
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !session?.user?.role) {
            return NextResponse.json({ message: "User not found", success: false });
        }
        
        const user = session.user;
        let unbilledSessions = [];


        if (user?.role === "Admin") {
            // Admin: Get all unbilled sessions across the platform
            unbilledSessions = await prisma.classSession.findMany({
                where: {
                    // Sessions that ARE in an active invoice (unbilled)
                    invoiceClasses: {
                        some: {
                            invoice: {
                                status: 'active',
                                isStudent: true // Only student's sessions, which have to be payed for
                            }
                        }
                    },
                    // Only include completed sessions
                    status: 'Completed'
                },
                include: {
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            perHr: true
                        }
                    },
                    student: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    endTime: 'desc'
                }
            });
            // unbilledSessions = await prisma.classSession.findMany({
            //     where: {
            //         status: 'Completed',
            //     }, 
            //     select: {
            //         invoiceClasses: {
            //             select:{
            //                 invoice: true,
            //             }
            //         }
            //     }
            
            // });
        } else if (user?.role === "Tutor") {
            // Tutor: Get their unbilled sessions
            unbilledSessions = await prisma.classSession.findMany({
                where: {
                    tutorId: parseInt(user.id),
                    // Sessions that ARE in an active invoice (unbilled)
                    invoiceClasses: {
                        some: {
                            invoice: {
                                status: 'active',
                                isStudent: false // Only tutor's sessions
                            }
                        }
                    },
                    // Only include completed sessions
                    status: 'Completed'
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    endTime: 'desc'
                }
            });
        } else if (user?.role === "Student") {
            // Student: Get their unbilled sessions
            unbilledSessions = await prisma.classSession.findMany({
                where: {
                    studentId: parseInt(user.id),
                    // Sessions that ARE in an active invoice (unbilled)
                    invoiceClasses: {
                        some: {
                            invoice: {
                                status: 'active',
                                isStudent: true
                            }
                        }
                    },
                    // Only include completed sessions
                    status: 'Completed'
                },
                include: {
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            perHr: true
                        }
                    }
                },
                orderBy: {
                    endTime: 'desc'
                }
            });
        } else {
            // User role not authorized
            return NextResponse.json({ 
                message: "Access denied", 
                success: false 
            }, { status: 403 });
        }

        // Calculate total amount for unbilled sessions
        // const totalAmount = unbilledSessions.reduce((sum, session) => {
        //     // Use tutor's per hour rate or default rate
        //     const rate = session.tutor?.perHr || 750;
        //     return sum + (session.duration * rate);
        // }, 0);

        return NextResponse.json({
            message: "unbilled sessions fetched", 
            data: unbilledSessions,
            success: true
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error in fetching unbilled sessions", success: false }, 
            { status: 500 }
        );
    }
}