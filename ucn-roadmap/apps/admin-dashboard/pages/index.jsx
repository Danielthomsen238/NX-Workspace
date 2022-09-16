import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Navbar from "../components/navbar"
import Users from "../components/Users"

const Index = () => {
    const { data: session, status } = useSession();

    const [data, setData] = useState()
    console.log(session)
    const config = {
        headers: { Authorization: `Bearer ${session?.user.token}` }
    };
    useEffect(() => {
        axios.get('http://localhost:4000/User')
            .then((response) => {
                console.log(response)
            })
            .catch((e) => {
                console.log(e)
            }
            )
    }, [])

    return (
        <>
            <Navbar />
            <Users />
        </>
    );
}
Index.auth = true
export default Index;