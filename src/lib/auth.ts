import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from '@next-auth/prisma-adapter' 
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
        newUser: '/signup'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text", placeholder: "Email" },
              password: { label: "Password", type: "password", placeholder: 'Password' }
            },
            //sends values into the jwt
            async authorize(credentials) {
              if(!credentials?.email || !credentials?.password){
                return null
              }

              const user = await prisma.user.findUnique({where: {email: credentials?.email}})
        
              if (!user) {
                return null
              } 

              const passwordMatch = await bcrypt.compare(credentials?.password, user.password);

              if(!passwordMatch){
                return null;
              }

              return {
                id: `${user.id}`, email: user.email, role: user.role, name: user.name
              }
            }
        })
    ],
    session: {
      strategy: "jwt",  
    },
    callbacks: {
      async session({ session, token }) {
        if (token) {
          session.user = {
            id: token.id,
            email: token.email,
            role: token.role,
            name: token.name
          };
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.role = user.role;
          token.name = user.name;
        }
        return token;
      }
    },
    secret: process.env.NEXTAUTH_SECRET
    
}