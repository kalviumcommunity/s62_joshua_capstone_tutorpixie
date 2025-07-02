import { prisma } from "@/lib/db"; 
import { NextResponse } from "next/server"; 

export async function GET() {
    try {
        const data = await prisma.invoices.findMany({
            include: {
                invoiceClasses: {
                    select: {
                        classSession: {
                            select: {
                                id: true,
                                topic: true,
                                duration: true,
                                status: true,
                                subject: true,
                                startTime: true,
                                endTime: true,
                                tutor: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                },
                                student: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: "invoices fetched", 
            data, 
            success: true
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Internal Server Error", 
            success: false
        }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        // Delete in correct order due to foreign key constraints
        await prisma.invoiceClassSession.deleteMany({});
        // await prisma.classSession.deleteMany({});
        await prisma.invoices.deleteMany({});
        
        return NextResponse.json({
            message: "deleted all invoice data", 
            success: true
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Internal Server error", 
            success: false
        }, { status: 500 });
    }
}