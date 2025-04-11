import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"


export default async function dashboard(){
    const session = await getServerSession(authOptions);
    const userType = session?.user?.role;

    return <>
        <h1 className="text-2xl font-bold mb-5">
            {userType === 'Student' ? 'Student Dashboard' : (userType==='Admin')?"Admin Dashboard":'Tutor Dashboard'}
        </h1>
    </>
}