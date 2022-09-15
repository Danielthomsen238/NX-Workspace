import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
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
    },[])

    return ( <h1>Users</h1> );
}
 
export default Users;