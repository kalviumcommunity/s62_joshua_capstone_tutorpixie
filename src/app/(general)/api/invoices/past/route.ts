import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        // Fetch past invoices from the database or any other source
        const session = await getServerSession(authOptions);
        if (!session?.user || !session?.user?.role) {
            return NextResponse.json({ message: "User not found, log in again", success: false }, { status: 401 });
        }
        const user = session.user;
        const userRole = user.role;
        let data = [];
        switch(userRole){
            case "Admin":
                data = await prisma.invoices.findMany({
                    where: {
                        userId: user.id,
                        status: "past"
                    },
                    select: {
                        id: true,
                        amt: true,
                        currency: true,
                        user: {
                            select:{
                                name: true
                            }
                        }, 
                        invoiceDate: true 
                    },
                    orderBy: {
                        invoiceDate: 'desc' 
                    }
                });
                break;
            case "Student":
                data = await prisma.invoices.findMany({
                    where: {
                        userId: parseInt(user.id),
                        isStudent: true,
                        status: "past"
                    },
                    select: {
                        id: true,
                        amt: true,
                        currency: true,
                        invoiceDate: true 
                    },
                    orderBy: {
                        invoiceDate: 'desc' 
                    }
                });
                break;
            case "Tutor":
                data = await prisma.invoices.findMany({
                    where: {
                        userId: parseInt(user.id),
                        isStudent: false,
                        status: "past"
                    },
                    select: {
                        id: true,
                        amt: true,
                        currency: true,
                        invoiceDate: true 
                    },
                    orderBy: {
                        invoiceDate: 'desc' 
                    }
                });
                break;
            default:
                return NextResponse.json({ message: "Invalid user role", success: false }, { status: 403 });
        }
        return NextResponse.json({ message: "Successfully fetched past invoices", data, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to fetch past invoices", success: false }, { status: 500 });
    }
}