import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import user_styles from '../src/styles/user.module.css';
import { useRouter } from 'next/router';

const UserUsers = () => {
  const { data: session, status } = useSession();
  const [runEffect, setRunEffect] = useState(false);
  const [userData, setData] = useState();
  const router = useRouter();
  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };

  useEffect(() => {
    axios
      .get('https://sequelize-roadmap.herokuapp.com/User', config)
      .then((response) => {
        setData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [runEffect]);

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
          setRunEffect((state) => !state);
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
        if (session.user.school_id == user.school.id) {
          return (
            <tr key={idx}>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.telefon}</td>
              <td>{user.email}</td>
              <td className={user_styles.action}>
                <div className={user_styles.OverButton}>
                  <button
                    className={user.id}
                    onClick={(e) => {
                      router.push(`users/${user.id}`);
                    }}
                  >
                    {' '}
                    <EditIcon className={user_styles.icon} />
                  </button>
                </div>
                <div className={user_styles.OverButton}>
                  <button id={user.id} onClick={DeleteData}>
                    <DeleteForeverIcon className={user_styles.icon} />
                  </button>
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
