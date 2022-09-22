import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import user_styles from '../src/styles/user.module.css';

const Users = () => {
  //States for user changes
  const { data: session, status } = useSession();
  const [runEffect, setRunEffect] = useState(false);
  const [userFirstname, setUserFirstname] = useState();
  const [userLastname, setUserLastname] = useState();
  const [userTelefon, setUserTelefon] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userSchoolName, setUserSchoolName] = useState();
  const [userRoleId, setUserRoleId] = useState();
  const [userActive, setUserActive] = useState();
  const [itemClicked, setItemClicked] = useState();
  const [userData, setData] = useState();
  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };
  //fetch data
  useEffect(() => {
    axios
      .get('https://sequelize-api.vercel.app/User', config)
      .then((response) => {
        console.log(response);
        setData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [runEffect]);
  //submit function to update user
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
      .put(`https://sequelize-api.vercel.app/User`, payload, config)
      .then((e, response) => {
        console.log(response);
        setRunEffect((state) => !state);
        setItemClicked(false);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log('penis');
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
    setUserSchoolName();
    setUserRoleId();
    setUserActive();
  };
  //function(not done) to delete user
  const DeleteData = (e) => {
    let person = prompt('Please confirm by typing, "DELETE"');
    if (person == 'DELETE') {
      alert('Deleted');
    } else if (person !== 'DELETED') {
      alert('Wrong');
    } else {
      return;
    }
  };
  //function for select/options for activ user
  const Other = (X) => {
    return !X;
  };
  //function to set the initial value of states if states is undefined on user clicked for editing
  const setInitaleValue = (
    firstname,
    lastname,
    telefon,
    email,
    school,
    role,
    active
  ) => {
    if (!userFirstname) {
      setUserFirstname(firstname);
    }
    if (!userLastname) {
      setUserLastname(lastname);
    }
    if (!userTelefon) {
      setUserTelefon(telefon);
    }
    if (!userEmail) {
      setUserEmail(email);
    }
    if (!userSchoolName) {
      setUserSchoolName(school);
    }
    if (!userRoleId) {
      setUserRoleId(role);
    }
    if (!userActive) {
      setUserActive(active);
    }
  };
  //Admin jsx (only admin can see this)
  if (session.user.role == 'Admin') {
    return (
      <>
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
                return (
                  <tr
                    key={idx}
                    className={
                      user.active == false ? user_styles.NotActive : ''
                    }
                  >
                    <td>
                      <input
                        type="text"
                        disabled={itemClicked == user.id ? '' : 'disabled'}
                        value={
                          itemClicked == user.id
                            ? userFirstname
                            : user.firstname
                        }
                        onChange={(e) => setUserFirstname(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        disabled={itemClicked == user.id ? '' : 'disabled'}
                        value={
                          itemClicked == user.id ? userLastname : user.lastname
                        }
                        onChange={(e) => setUserLastname(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        disabled={itemClicked == user.id ? '' : 'disabled'}
                        value={
                          itemClicked == user.id ? userTelefon : user.telefon
                        }
                        onChange={(e) => setUserTelefon(e.target.value)}

                      />
                    </td>
                    <td>
                      <div
                        style={
                          itemClicked == user.id
                            ? { resize: 'horizontal' }
                            : { resize: 'none' }
                        }
                      >
                        <input
                          type="email"
                          disabled={itemClicked == user.id ? '' : 'disabled'}
                          value={
                            itemClicked == user.id ? userEmail : user.email
                          }
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
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
                          value={
                            itemClicked == user.id
                              ? userSchoolName
                              : user.school.name
                          }
                          onChange={(e) => setUserSchoolName(e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        disabled={itemClicked == user.id ? '' : 'disabled'}
                        value={
                          itemClicked == user.id ? userRoleId : user.role_id
                        }
                        onChange={(e) => setUserRoleId(e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        name="active"
                        id="active"
                        value={
                          itemClicked == user.id ? userActive : user.active
                        }
                        onChange={(e) => setUserActive(e.target.value)}
                        disabled={itemClicked == user.id ? null : true}
                      >
                        <option
                          value={user.active.toString()}
                          className={user.active.toString()}
                        >
                          {user.active.toString()}
                        </option>
                        <option
                          value={Other(user.active).toString()}
                          className={Other(user.active).toString()}
                        >
                          {Other(user.active).toString()}
                        </option>
                      </select>
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
                                setInitaleValue(
                                  user.firstname,
                                  user.lastname,
                                  user.telefon,
                                  user.email,
                                  user.school.name,
                                  user.role_id,
                                  user.active
                                );
                              }}
                            ></button>
                            <EditIcon className={user_styles.icon} />
                          </div>
                        )}
                      <div className={user_styles.OverButton}>
                        <button onClick={DeleteData}></button>
                        <DeleteForeverIcon className={user_styles.icon} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  //user jsx (only user can see this )
  if (session.user.role == 'User') {
    return (
      <>
        <div className={user_styles.body}>
          <table className={user_styles.table}>
            <thead>
              <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Telefon</th>
                <th>E-mail</th>
                <th>School Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData?.data.map((user, idx) => {
                if (session.user.school_name == user.school.name) {
                  return (
                    <tr
                      key={idx}
                      className={
                        user.active == false ? user_styles.NotActive : ''
                      }
                    >
                      <td>
                        <input
                          type="text"
                          disabled={itemClicked == user.id ? '' : 'disabled'}
                          value={
                            itemClicked == user.id
                              ? userFirstname
                              : user.firstname
                          }
                          onChange={(e) => setUserFirstname(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          disabled={itemClicked == user.id ? '' : 'disabled'}
                          value={
                            itemClicked == user.id
                              ? userLastname
                              : user.lastname
                          }
                          onChange={(e) => setUserLastname(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          disabled={itemClicked == user.id ? '' : 'disabled'}
                          value={
                            itemClicked == user.id ? userTelefon : user.telefon
                          }
                          onChange={(e) => setUserTelefon(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          disabled={itemClicked == user.id ? '' : 'disabled'}
                          value={
                            itemClicked == user.id ? userEmail : user.email
                          }
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          disabled={itemClicked == user.id ? '' : 'disabled'}
                          value={
                            itemClicked == user.id
                              ? userSchoolName
                              : user.school.name
                          }
                          onChange={(e) => setUserSchoolName(e.target.value)}
                        />
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
                                  setInitaleValue(
                                    user.firstname,
                                    user.lastname,
                                    user.telefon,
                                    user.email,
                                    user.school.name,
                                    user.role_id,
                                    user.active
                                  );
                                }}
                              ></button>
                              <EditIcon className={user_styles.icon} />
                            </div>
                          )}
                        <div className={user_styles.OverButton}>
                          <button onClick={DeleteData}></button>
                          <DeleteForeverIcon className={user_styles.icon} />
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
};

export default Users;
