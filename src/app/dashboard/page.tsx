import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"


export default async function dashboard({statcard}:{statcard:React.ReactNode}){
    return <>
        <h1>
            Dashboard page
        </h1>
    </>
}