import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import user_styles from '../src/styles/user.module.css';
import ActiveUsers from './ActiveUsers';
import UserUsers from './UserUsers';
import UnActiveUsers from './UnActiveUsers';
import axios from 'axios';

const Users = () => {
  const [userData, setData] = useState();
  const [runEffect, setRunEffect] = useState(false);
  //States for user changes
  const { data: session, status } = useSession();
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

  if (session.user.role == 'Admin') {
    return (
      <div className={user_styles.container}>
        <h2 className={user_styles.table_h2}>
          &#x2022; Brugere der venter på blive aktiveret
        </h2>
        <div className={user_styles.admin_body}>
          <table className={user_styles.table}>
            <thead>
              <tr>
                <th>Fornavn</th>
                <th>Efternavn</th>
                <th>Telefon</th>
                <th>E-mail</th>
                <th>Skole Navn</th>
                <th>Role</th>
                <th>Aktiveret</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              <UnActiveUsers userData={userData} runEffect={setRunEffect} />
            </tbody>
          </table>
        </div>
        <h2 className={user_styles.table_h2}>
          &#x2022; Brugere der er aktiveret
        </h2>
        <div className={user_styles.admin_body}>
          <table className={user_styles.table}>
            <thead>
              <tr>
                <th>Fornavn</th>
                <th>Efternavn</th>
                <th>Telefon</th>
                <th>E-mail</th>
                <th>Skole Navn</th>
                <th>Role</th>
                <th>Aktiveret</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              <ActiveUsers userData={userData} runEffect={setRunEffect} />
            </tbody>
          </table>
        </div>
        <Link href="/createUser">
          <div className={user_styles.create_user_btn}>Opret Bruger</div>
        </Link>
      </div>
    );
  }
  //user jsx (only user can see this )
  if (session.user.role == 'User') {
    return (
      <div className={user_styles.container}>
        <div className={user_styles.user_body}>
          <table className={user_styles.table}>
            <thead>
              <tr>
                <th>Fornavn</th>
                <th>Efternavn</th>
                <th>Telefon</th>
                <th>E-mail</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              <UserUsers />
            </tbody>
          </table>
        </div>
        <Link href="/createUser">
          <div className={user_styles.create_user_btn}>Opret Bruger</div>
        </Link>
      </div>
    );
  }
};

export default Users;
