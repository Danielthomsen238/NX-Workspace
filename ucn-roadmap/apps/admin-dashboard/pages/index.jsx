import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Navbar from "../components/navbar"
import Users from "../components/Users"

const Index = () => {
    const { data: session, status } = useSession();

    return (
        <>
            <Navbar />
            <Users />
        </>
    );
}
Index.auth = true
export default Index;