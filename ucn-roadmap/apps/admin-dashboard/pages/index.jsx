import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Navbar from "../components/navbar"
import Users from "../components/Users"
import { useState, useEffect } from "react"
import axios from "axios"

const Index = () => {
    const { data: session, status } = useSession();

    const [data, setData] = useState()
    console.log(session)
    useEffect(() => {
        axios.get('http://localhost:4000/User')
            .then((response) => {
                setData(response)
            })
            .catch((e) => {
                console.log(e)
            }
            )
    }, [])

    return (
        <>
            <div className="global_body">
                <Navbar />
                <Users data={data} />
            </div>
        </>
    );
}
Index.auth = true
export default Index;