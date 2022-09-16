import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
    const { data: session, status } = useSession();



    return (<>
        <table>
            <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Telefon</th>
                <th>E-mail</th>
                <th>School_id</th>
                <th>Role_id</th>
                <th>Active</th>
            </tr>
        </table>
    </>);
}

export default Users;