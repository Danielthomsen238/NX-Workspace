import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Navbar from "../components/navbar"

const adminDashBoard = () => {
    const { data: session, status } = useSession();

    return (
        <>
            <Navbar />
        </>
    );
}
adminDashBoard.auth = true
export default adminDashBoard;