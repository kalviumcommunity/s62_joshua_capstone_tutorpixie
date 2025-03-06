import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
export default async function statcard(){
    const session = await getServerSession(authOptions);
    console.log(session);
    return <h1>Welcome {session?.user?.role}</h1>
}