import { useSession } from 'next-auth/react';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import user_styles from '../src/styles/user.module.css';
import { useRouter } from 'next/router';

const UnActiveUsers = (props) => {
  const { userData, runEffect } = props;
  const { data: session, status } = useSession();

  const router = useRouter();
  //header config for api

  //function(not done) to delete user
  const DeleteData = (e) => {
    let person = prompt('Please confirm by typing, "DELETE"');
    if (person == 'DELETE') {
      const payload = {
        headers: { authorization: `Bearer ${session?.user.token}` },
        data: { id: e.target.id },
      };
      axios
        .delete(`https://sequelize-roadmap.herokuapp.com/User`, payload)
        .then((response) => {
          runEffect((state) => !state);
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
        if (user.active == false) {
          return (
            <tr key={idx}>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.telefon}</td>
              <td>{user.email}</td>
              <td>{user.school.name}</td>
              <td>{user.role_id === 1 ? 'Admin' : 'User'}</td>
              <td>{user.active ? 'aktiv' : 'ikke aktiv'}</td>
              <td className={user_styles.action}>
                <div className={user_styles.OverButton}>
                  <button
                    className={user.id}
                    onClick={() => {
                      router.push(`/users/${user.id}`);
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
export default UnActiveUsers;
