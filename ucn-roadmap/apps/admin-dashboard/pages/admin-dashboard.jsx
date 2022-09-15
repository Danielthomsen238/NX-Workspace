import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

const adminDashBoard = () => {
    const { data: session, status } = useSession();

    return (
        <>

        </>
    );
}
adminDashBoard.auth = true
export default adminDashBoard;