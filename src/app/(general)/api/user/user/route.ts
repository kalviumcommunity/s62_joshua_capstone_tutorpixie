import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const tutors  = await prisma.user.findMany({where: {role:"User"}});
        return NextResponse.json({data:tutors, message: "Users fetched", success: true})
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error", success: false});
    }
}