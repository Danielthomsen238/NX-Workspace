import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState, useQuery } from "react";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import user_styles from '../src/styles/user.module.css'


const Users = (props) => {

    const { session, status } = useSession();
    const { data } = props
    const [itemClicked, setItemClicked] = useState()

    console.log(data)

    const ToggleItem = () => {
        const [toggleThisElement, setToggleThisElement] = useState(false);
        return (
            <button
                onClick={() => setToggleThisElement((prev) => !prev)}
            >
                {toggleThisElement.toString()}
            </button>
        );
    };

    const HandleClick = (e) => {
        setItemClicked(e.target.value)
        console.log(itemClicked)
    }

    const DeleteData = (e) => {
        let person = prompt('Please confirm by typing, "DELETE"');
        let text;
        if (person == "DELETE") {
            alert("Deleted")
        }
        else {
            alert("Wrong")
        }
    }


    function Other(X) {
        return !X;
    }




    return (<>
        <div className={user_styles.body}>
            <table className={user_styles.table}>
                <thead>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Telefon</th>
                        <th>E-mail</th>
                        <th>School_id</th>
                        <th>Role_id</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.data.map((user, idx) => {
                        return (<tr key={idx}>
                            {console.log(itemClicked)}
                            <td contenteditable={itemClicked == user.id ? 'true' : 'false'}>{user.firstname}</td>
                            <td contenteditable={itemClicked == user.id ? 'true' : 'false'}>{user.lastname}</td>
                            <td contenteditable={itemClicked == user.id ? 'true' : 'false'}>{user.telefon}</td>
                            <td contenteditable={itemClicked == user.id ? 'true' : 'false'}>{user.email}</td>
                            <td contenteditable={itemClicked == user.id ? 'true' : 'false'}>{user.school.name}</td>
                            <td contenteditable={itemClicked == user.id ? 'true' : 'false'}>{user.role_id}</td>
                            <td contenteditable={itemClicked == user.id ? 'true' : 'false'}>
                                <select name="cars" id="cars" disabled={itemClicked == user.id ? null : 'true'}>
                                    <option value={user.active.toString()}>{user.active.toString()}</option>
                                    <option value={Other(user.active).toString()}>{Other(user.active).toString()}</option>
                                </select></td>
                            <td>{itemClicked == user.id ? <button> <CheckIcon /> <ClearIcon /></button> : <button value={user.id} onClick={HandleClick}><EditIcon className={user_styles.icon} /></button>}<button onClick={DeleteData}><DeleteForeverIcon /></button></td>

                        </tr>)
                    })}
                </tbody>
            </table>
        </div>

    </>);
}

export default Users;