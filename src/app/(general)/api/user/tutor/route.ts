import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const tutors  = await prisma.user.findMany({where: {role:"Tutor"}});
        return NextResponse.json({data:tutors, message: "Tutors fetched", success: true})
    } catch (error) {
        return NextResponse.json({message: "INternal Server Error", success: false});
    }
}