"use server";

import { prisma } from "./db";
import {v4 as uuidv4} from "uuid";

export const generateVerificationToken = async (email: string) =>{
    const token = uuidv4();
    console.log("Generated token:", token);
    const expires = new Date(new Date().getTime() + 1800*1000); // 30 mins expiration

    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken) await prisma.verificationToken.delete({
        where : {id: existingToken.id},
    })

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verificationToken;
}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
       const token = await prisma.verificationToken.findFirst({
           where: { email }
       });
       return token;
    } catch (error) {
        return null;
    }
}

export const getVerificationTokenByToken = async (token: string) => {
    try {
       const verificationToken = await prisma.verificationToken.findUnique({
           where: { token }
       });
       return verificationToken;
    } catch (error) {
        return null;
    }
}