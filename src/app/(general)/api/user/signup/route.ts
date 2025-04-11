import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body)
        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { message: "Invalid request body", success: false },
                { status: 400 }
            );
        }

        if (!body.email || !body.password) {
            return NextResponse.json(
                { message: "Email and password are required", success: false },
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (userExists) {
            return NextResponse.json(
                { message: "User already exists", success: false },
                { status: 409 }
            );
        }

        const hashPassword = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: { ...body, password: hashPassword },
        });

        return NextResponse.json({ message: "User created", success: true });
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
}