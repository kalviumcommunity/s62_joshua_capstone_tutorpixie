import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        const { id } = await params;
        const data = await prisma.invoices.findUnique({
            where: {
                id: id
            },
            select: {
                invoiceClasses: {
                    select: {
                        classSession: {
                            select: {
                                id: true,
                                startTime: true,
                                subject: true,
                                duration: true,
                            }
                        }
                    }
                }
            }
        })
        if(!data){
            return NextResponse.json({
                message: "Invoice not found",
                success: false
            }, { status: 404 });
        }

        const mappedData = data.invoiceClasses.map((item) => {
            return {
                id: item.classSession.id,
                startTime: item.classSession.startTime,
                subject: item.classSession.subject,
                duration: item.classSession.duration,
            }
        })

        return NextResponse.json({
            message: "Fetched billed sessions for invoice",
            data: mappedData || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error fetching sessions",
            success: false
        }, { status: 500 });
    }
}