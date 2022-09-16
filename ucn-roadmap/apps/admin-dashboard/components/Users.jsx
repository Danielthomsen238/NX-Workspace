import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
    const { data: session, status } = useSession();
    const [data, setData] = useState()
    const [router, setRouter] = useState("user")
    console.log(session)
    const config = {
        headers: { Authorization: `Bearer ${session?.user.token}` }
    };
    useEffect(() => {
        axios.get(`http://localhost:4000/${router}`)
        .then((response) => {
            console.log(response)
    })
    .catch((e) => {
        console.log(e) 
    }
    )
    },[router])

    return ( <h1>Users</h1> );
}
 
export default Users;