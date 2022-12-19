/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-no-duplicate-props */
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import school_styles from '../src/styles/school.module.css';
import { useRouter } from 'next/router';

const Schools = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [runEffect, setRunEffect] = useState(false);
  const [schoolData, setData] = useState();
  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };

  //fetch data
  useEffect(() => {
    axios
      .get('https://sequelize-roadmap.herokuapp.com/School', config)
      .then((response) => {
        console.log(response);
        setData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [runEffect]);

  //submit function to update school

  //function(not done) to delete user
  const DeleteData = (e) => {
    let person = prompt('Please confirm by typing, "DELETE"');
    if (person == 'DELETE') {
      const payload = {
        headers: { authorization: `Bearer ${session?.user.token}` },
        data: { id: e.target.id },
      };
      axios
        .delete(`https://sequelize-roadmap.herokuapp.com/School`, payload)
        .then((response) => {
          console.log(response);
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

  //function to set the initial value of states if states is undefined on user clicked for editing

  //Admin jsx (only admin can see this)
  if (session.user.role == 'Admin') {
    return (
      <>
        <div className={school_styles.body}>
          <table className={school_styles.table}>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Billede</th>
                <th>Adresse</th>
                <th>Post nr</th>
                <th>By</th>
                <th>Om os</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              {schoolData?.data.map((school, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      <div>{school.name}</div>
                    </td>
                    <td>{school.telefon}</td>
                    <td>{school.email}</td>
                    <td>{school.image ? school.image : 'Ingen billed'}</td>
                    <td>{school.address}</td>
                    <td>{school.zip}</td>
                    <td>{school.city}</td>
                    <td>
                      <div>{school.description}</div>
                    </td>
                    <td className={school_styles.action}>
                      <div className={school_styles.OverButton}>
                        <button
                          className={school.id}
                          onClick={() => router.push(`/schools/${school.id}`)}
                        ></button>
                        <EditIcon className={school_styles.icon} />
                      </div>
                      <div className={school_styles.OverButton}>
                        <button id={school.id} onClick={DeleteData}></button>
                        <DeleteForeverIcon className={school_styles.icon} />
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
  if (session.user.role != 'Admin') {
    router.push(`/schools/${session.user.school_id}`);
    return;
  }
};

export default Schools;
