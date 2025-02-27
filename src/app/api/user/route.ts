import { NextResponse } from "next/server";
import {prisma} from '@/lib/db'

export async function GET(){
    try {
        const users = await prisma.user.findMany()

        if (!users || users.length === 0) {
            return NextResponse.json({
                message: "No users found",
                data: [],
                success: true, 
            });
        }

        return NextResponse.json({message: "Users fetched", data:users, success: true})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Internal Server Error", success: false})
    }
}