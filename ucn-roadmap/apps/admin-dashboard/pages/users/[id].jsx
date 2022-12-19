import axios from 'axios';
import { useState } from 'react';
import createUse_styles from '../../src/styles/createUser.module.css';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import Animate from 'apps/admin-dashboard/components/Animate';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const id = context.params.id;
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };
  try {
    const result = await axios.get(
      `https://sequelize-roadmap.herokuapp.com/User/${id}`,
      config
    );
    const data = result.data;
    console.log(data);
    return {
      props: {
        user: data,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

const CourseDetail = ({ user }) => {
  // console.log(user);
  const router = useRouter();
  const { query } = useRouter();
  console.log(query);
  const { data: session, status } = useSession();
  const [userFirstname, setUserFirstname] = useState(user.firstname);
  const [userLastname, setUserLastname] = useState(user.lastname);
  const [userTelefon, setUserTelefon] = useState(user.telefon);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userRoleId, setUserRoleId] = useState(user.role_id);
  const [userActive, setUserActive] = useState(user.active);

  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };

  const handleSubmit = (e) => {
    const payload = {
      id: query.id,
      firstname: userFirstname,
      lastname: userLastname,
      telefon: userTelefon,
      email: userEmail,
      role_id: userRoleId,
      active: userActive,
    };
    console.log(payload);
    axios
      .put(`https://sequelize-roadmap.herokuapp.com/User`, payload, config)
      .then((response) => {
        console.log(response);
        // router.push('/userList');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //function that makes editing true

  return (
    <Animate>
      <div className={createUse_styles.body}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className={createUse_styles.form}
        >
          <fieldset>
            <legend>Opdater Bruger</legend>
            <input
              type="text"
              name="user_email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <input
              type="text"
              name="user_firstname"
              placeholder="Fornavn"
              value={userFirstname}
              onChange={(e) => setUserFirstname(e.target.value)}
              required
            />
            <input
              type="text"
              name="user_lastname"
              placeholder="Efternavn"
              value={userLastname}
              onChange={(e) => setUserLastname(e.target.value)}
              required
            />
            <input
              type="text"
              name="user_phone"
              placeholder="Telefon"
              value={userTelefon}
              onChange={(e) => setUserTelefon(e.target.value)}
              required
            />
          </fieldset>
          <div className={createUse_styles.button_container}>
            <button type="submit">Opdater Bruger</button>
          </div>
        </form>
      </div>
    </Animate>
  );
};
CourseDetail.auth = true;
export default CourseDetail;
