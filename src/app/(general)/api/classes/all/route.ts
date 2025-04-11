import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const classes = await prisma.classSession.findMany();
        console.log("Classes Fetched");
        return NextResponse.json({message: "Classes fetched", success: true, classes});
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({message: "Internal server error in fetching classes", success: false});
        
    }
}