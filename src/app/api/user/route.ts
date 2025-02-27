import { NextResponse } from "next/server";
import {prisma} from '@/lib/db'

export async function GET(){
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json({message: "Users fetched", data:users, success: true})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", success: false})
    }
}