import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { BillingData } from "@/components/billing/CurrentInvoice";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !session?.user?.role) {
            return NextResponse.json({ message: "User not found, log in again", success: false }, { status: 401 });
        }
        
        const user = session.user;
        let billingData: BillingData;

        if (user.role === 'Admin') {
            // Admin sees aggregated billing data across all active invoices
            const billingInfo = await prisma.invoices.findMany({
                where: {
                    status: "active"
                },
                select: {
                    amt: true,
                    currency: true,
                    isStudent: true,
                    invoiceClasses: {
                        select: {
                            classSession: {
                                select: {
                                    duration: true,
                                    subject: true
                                }
                            }
                        }
                    }
                },
            });

            // Aggregate data for admin
            let totalAmount = 0.0;
            let totalHours = 0.0;
            let tutorPayout = 0.0;
            const subjectsSet = new Set<string>();

            billingInfo.forEach(invoice => {
                if(invoice.isStudent){
                    totalAmount += invoice.amt;
                    invoice.invoiceClasses.forEach(invoiceClass => {
                        totalHours += invoiceClass.classSession.duration;
                        subjectsSet.add(invoiceClass.classSession.subject);
                    });
                } 
                else tutorPayout += invoice.amt;
            });

            billingData = {
                totalAmount,
                totalHours,
                tutorPayout,
                subjects: Array.from(subjectsSet),
                currency: billingInfo[0]?.currency || 'INR',
            };

        } else if (user.role === "Student" || user.role === "Tutor") {
            // Individual user billing data
            const billingInfo = await prisma.invoices.findFirst({
                where: {
                    userId: parseInt(user?.id),
                    status: "active",
                },
                select: {
                    id: true,
                    amt: true,
                    currency: true,
                    invoiceClasses: {
                        select: {
                            classSession: {
                                select: {
                                    duration: true,
                                    subject: true
                                }
                            }
                        }
                    }
                },
            });

            if (!billingInfo) {
                // No active invoice found, return default values
                billingData = {
                    totalAmount: 0,
                    totalHours: 0,
                    subjects: [],
                    currency: 'INR',
                };
            } else {
                // Calculate totals from invoice class sessions
                let totalHours = 0;
                const subjectsSet = new Set<string>();

                billingInfo.invoiceClasses.forEach(invoiceClass => {
                    totalHours += invoiceClass.classSession.duration;
                    subjectsSet.add(invoiceClass.classSession.subject);
                });

                billingData = {
                    totalAmount: billingInfo.amt,
                    totalHours,
                    subjects: Array.from(subjectsSet),
                    currency: billingInfo.currency,
                    invoiceId: billingInfo.id,
                };
            }

        } else {
            console.log("Invalid User Role:", user.role);
            return NextResponse.json({ message: "Invalid User Role", success: false }, { status: 403 });
        }

        return NextResponse.json({ 
            message: "Billing data successfully fetched",
            data: billingData, 
            success: true 
        }, { status: 200 });

    } catch (error) {
        console.error("Error in fetching billing data:", error);
        return NextResponse.json({ 
            message: "Error in fetching billing data", 
            success: false 
        }, { status: 500 });
    }
}