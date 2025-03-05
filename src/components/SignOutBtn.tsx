"use client";
import { signOut } from "next-auth/react";

export default function SignOutBtn(){
    return <div>
        <button className="p-2 rounded-md bg-red-500 text-white" onClick={()=>signOut()}>Sign Out</button>
    </div>
}