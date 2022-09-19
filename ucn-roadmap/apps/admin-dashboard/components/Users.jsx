import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import user_styles from '../src/styles/user.module.css'


const Users = () => {

    const {data: session, status } = useSession();
    const [userFirstname, setUserFirstname] = useState()
    const [userLastname, setUserLastname] = useState()
    const [userTelefon, setUserTelefon] = useState()
    const [userEmail, setUserEmail] = useState()
    const [userSchoolName, setUserSchoolName] = useState()
    const [userRoleId, setUserRoleId] = useState()
    const [userActive, setUserActive] = useState()
    const [itemClicked, setItemClicked] = useState()
    const [userData, setData] = useState()

    const config = {
        headers: { authorization: `Bearer ${session?.user.token}` }
    };
    useEffect(() => {
    
        axios.get('https://sequelize-api.vercel.app/User', config)
            .then((response) => {
                console.log(response)
                setData(response)
            })
            .catch((e) => {
                console.log(e)
            }
            )
    }, [])

    const handleSubmit = () => {
        const payload = {
            id: itemClicked,
            firstname: userFirstname,
            lastname: userLastname,
            telefon: userTelefon,
            email: userEmail,
            role_id: userRoleId,
            active: userActive
        }
        axios.put(`https://sequelize-api.vercel.app/User`, payload ,config)
        .then((response) => {
            console.log(response)
        })
        .catch((e) => {
            console.log(e)
        }
        )
        console.log("penis")
    }

    const HandleEdit = (e) => {
        setItemClicked(e.target.className)
    }

    const HandleCancel = (e) => {
        setItemClicked(e.target.className)
        setUserFirstname()
        setUserLastname()
        setUserTelefon()
        setUserEmail()
        setUserSchoolName()
        setUserRoleId()
        setUserActive()

    }

    const DeleteData = (e) => {
        let person = prompt('Please confirm by typing, "DELETE"');
        if (person == "DELETE") {
            alert("Deleted")
        }
        else if(person !== "DELETED"){
            alert("Wrong")
        }
        else {
            return
        }
    }




    const Other = (X) => {
        return !X;
    }

    const setInitaleValue = (firstname, lastname, telefon, email, school, role, active) => {
        if(!userFirstname){
         setUserFirstname(firstname)}
         if(!userLastname){
            setUserLastname(lastname)}
            if(!userTelefon){
                setUserTelefon(telefon)}
                if(!userEmail){
                    setUserEmail(email)}
                    if(!userSchoolName){
                        setUserSchoolName(school)}
                        if(!userRoleId){
                            setUserRoleId(role)}
                            if(!userActive){
                                setUserActive(active)}
           
       }
  

    if(session.user.role == "Admin"){
        return (<>
            <div className={user_styles.body}>
                <table className={user_styles.table}>
                    <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Telefon</th>
                            <th>E-mail</th>
                            <th>School Name
                            </th>
                            <th>Role_id</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData?.data.map((user, idx) => {
                            return (<tr key={idx} className={user.active == false ? user_styles.NotActive : ""}>
                                <td ><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userFirstname : user.firstname } onChange={(e) => setUserFirstname(e.target.value)} /></td>
                                <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userLastname : user.lastname } onChange={(e) => setUserLastname(e.target.value)} /></td>
                                <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userTelefon : user.telefon } onChange={(e) => setUserTelefon(e.target.value)} /></td>
                                <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userEmail : user.email } onChange={(e) => setUserEmail(e.target.value)} /></td>
                                <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userSchoolName : user.school.name } onChange={(e) => setUserSchoolName(e.target.value)} /></td>
                                <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userRoleId : user.role_id } onChange={(e) => setUserRoleId(e.target.value)} /></td>
                                <td>
                                    <select name="active" id="active" value={itemClicked == user.id ? userActive : user.active } onChange={(e) => setUserActive(e.target.value)} disabled={itemClicked == user.id ? null : true}>
                                        <option value={user.active.toString()} className={user.active.toString()}>{user.active.toString()}</option>
                                        <option value={Other(user.active).toString()} className={Other(user.active).toString()}>{Other(user.active).toString()}</option>
                                    </select></td>
                                <td>{itemClicked == user.id ? <button> <CheckIcon onClick={handleSubmit}/> <ClearIcon onClick={HandleCancel} /></button> : <div className={user_styles.OverButton}><button className={user.id} onClick={(e) => {
                                    HandleEdit(e) 
                                    setInitaleValue(user.firstname, user.lastname, user.telefon, user.email, user.school.name, user.role_id, user.active)}}></button><EditIcon/></div>}<div className={user_styles.OverButton}><button onClick={DeleteData}></button><DeleteForeverIcon/></div></td>
    
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
    
        </>);
    }
    if(session.user.role == "User"){
        return (<>
            <div className={user_styles.body}>
                <table className={user_styles.table}>
                    <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Telefon</th>
                            <th>E-mail</th>
                            <th>School Name</th>
                            <th>Role_id</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData?.data.map((user, idx) => {
                            if(session.user.school_name == user.school.name){return (<tr key={idx} className={user.active == false ? user_styles.NotActive : ""}>
                            <td ><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userFirstname : user.firstname } onChange={(e) => setUserFirstname(e.target.value)} /></td>
                            <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userLastname : user.lastname } onChange={(e) => setUserLastname(e.target.value)} /></td>
                            <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userTelefon : user.telefon } onChange={(e) => setUserTelefon(e.target.value)} /></td>
                            <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userEmail : user.email } onChange={(e) => setUserEmail(e.target.value)} /></td>
                            <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userSchoolName : user.school.name } onChange={(e) => setUserSchoolName(e.target.value)} /></td>
                            <td><input type="text" disabled={itemClicked == user.id ? '' : 'disabled'} value={itemClicked == user.id ? userRoleId : user.role_id } onChange={(e) => setUserRoleId(e.target.value)} /></td>
                            <td>
                                <select name="active" id="active" value={itemClicked == user.id ? userActive : user.active } onChange={(e) => setUserActive(e.target.value)} disabled={itemClicked == user.id ? null : true}>
                                    <option value={user.active.toString()} className={user.active.toString()}>{user.active.toString()}</option>
                                    <option value={Other(user.active).toString()} className={Other(user.active).toString()}>{Other(user.active).toString()}</option>
                                </select></td>
                            <td>{itemClicked == user.id ? <button> <CheckIcon onClick={handleSubmit}/> <ClearIcon onClick={HandleCancel} /></button> : <div className={user_styles.OverButton}><button className={user.id} onClick={(e) => {
                                HandleEdit(e) 
                                setInitaleValue(user.firstname, user.lastname, user.telefon, user.email, user.school.name, user.role_id, user.active)}}></button><EditIcon/></div>}<div className={user_styles.OverButton}><button onClick={DeleteData}></button><DeleteForeverIcon/></div></td>

                        </tr>)}
                            
                        })}
                    </tbody>
                </table>
            </div>
    
        </>);
    }
}

export default Users;