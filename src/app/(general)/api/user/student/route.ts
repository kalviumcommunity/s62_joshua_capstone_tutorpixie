import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const students  = await prisma.user.findMany({where: {role:"Student"}, select: {name: true, id: true, email:true, country: true}});
        return NextResponse.json({data:students, message: "Students fetched", success: true})
    } catch (error) {
        return NextResponse.json({message: "INternal Server Error", success: false});
    }
}