import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import user_styles from '../src/styles/user.module.css';

const UserUsers = () => {
  const { data: session, status } = useSession();
  const [runEffect, setRunEffect] = useState(false);
  const [userFirstname, setUserFirstname] = useState();
  const [userLastname, setUserLastname] = useState();
  const [userTelefon, setUserTelefon] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userRoleId, setUserRoleId] = useState();
  const [userActive, setUserActive] = useState();
  const [itemClicked, setItemClicked] = useState();
  const [userData, setData] = useState();

  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };

  useEffect(() => {
    axios
      .get('https://sequelize-roadmap.herokuapp.com/User', config)
      .then((response) => {
        console.log(response);
        setData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [runEffect]);

  const handleSubmit = (e) => {
    const payload = {
      id: itemClicked,
      firstname: userFirstname,
      lastname: userLastname,
      telefon: userTelefon,
      email: userEmail,
      role_id: userRoleId,
      active: userActive,
    };
    axios
      .put(`https://sequelize-roadmap.herokuapp.com/User`, payload, config)
      .then((response) => {
        console.log(response);
        setRunEffect((state) => !state);
        setItemClicked(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //function that makes editing true
  const HandleEdit = (e) => {
    setItemClicked(e.target.className);
  };
  //function to cancel the editing
  const HandleCancel = (e) => {
    setItemClicked(e.target.className);
    setUserFirstname();
    setUserLastname();
    setUserTelefon();
    setUserEmail();
    setUserRoleId();
    setUserActive();
  };
  //function(not done) to delete user
  const DeleteData = (e) => {
    let person = prompt('Please confirm by typing, "DELETE"');
    if (person == 'DELETE') {
      const payload = {
        headers: { authorization: `Bearer ${session?.user.token}` },
        data: { id: e.target.id },
      };
      axios
        .delete(`https://sequelize-api.vercel.app/User`, payload)
        .then((response) => {
          console.log(response);
          setRunEffect((state) => !state);
          setItemClicked(false);
        })
        .catch((e) => {
          console.log(e);
        });

      alert('Deleted');
    } else if (person !== 'DELETE' && person !== null) {
      alert('du tastede forkert');
      return;
    } else {
      return;
    }
  };

  return (
    <>
      {userData?.data.map((user, idx) => {
        if (session.user.school_name == user.school.name) {
          return (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  disabled={itemClicked == user.id ? '' : 'disabled'}
                  value={
                    itemClicked == user.id ? userFirstname : user.firstname
                  }
                  onChange={(e) => setUserFirstname(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={itemClicked == user.id ? '' : 'disabled'}
                  value={itemClicked == user.id ? userLastname : user.lastname}
                  onChange={(e) => setUserLastname(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  disabled={itemClicked == user.id ? '' : 'disabled'}
                  value={itemClicked == user.id ? userTelefon : user.telefon}
                  onChange={(e) => setUserTelefon(e.target.value)}
                />
              </td>
              <td>
                {' '}
                <div
                  style={
                    itemClicked == user.id
                      ? { resize: 'horizontal' }
                      : { resize: 'none' }
                  }
                >
                  <input
                    type="text"
                    disabled={itemClicked == user.id ? '' : 'disabled'}
                    value={itemClicked == user.id ? userEmail : user.email}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              </td>
              <td>
                {itemClicked == user.id ? (
                  <button>
                    <CheckIcon
                      className={user_styles.icon}
                      onClick={handleSubmit}
                    />
                    <ClearIcon
                      className={user_styles.icon}
                      onClick={HandleCancel}
                    />
                  </button>
                ) : (
                  <div className={user_styles.OverButton}>
                    <button
                      className={user.id}
                      onClick={(e) => {
                        HandleEdit(e);
                        setUserFirstname(user.firstname);
                        setUserLastname(user.lastname);
                        setUserTelefon(user.telefon);
                        setUserEmail(user.email);
                        setUserRoleId(user.role_id);
                        setUserActive(user.active);
                      }}
                    ></button>
                    <EditIcon className={user_styles.icon} />
                  </div>
                )}
                <div className={user_styles.OverButton}>
                  <button id={user.id} onClick={DeleteData}></button>
                  <DeleteForeverIcon className={user_styles.icon} />
                </div>
              </td>
            </tr>
          );
        }
      })}
    </>
  );
};

export default UserUsers;
