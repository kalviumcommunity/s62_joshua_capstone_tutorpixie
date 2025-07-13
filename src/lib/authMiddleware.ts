import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const withAuth = (handler) => async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if(!session || !session.user) {
        throw new Error("Unauthorized access - please log in");
    }

    req.user = session.user;

    return handler(req, res);
}