import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import login_styles from '../src/styles/login.module.css';
import frontpage_styles from '../src/styles/frontpage.module.css';
import Animate from '../components/Animate';

const Index = () => {
  const { data: session, status } = useSession();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();
  console.log(session);
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };

  const handleSubmit = (e) => {
    if (password == confirmPassword) {
      const payload = {
        id: session.user.userID,
        password: password,
        otp: null,
      };
      axios
        .put(
          `https://sequelize-roadmap.herokuapp.com/updatepass`,
          payload,
          config
        )
        .then((response) => {
          console.log(response);
          alert(
            'Koden er gemt du vil nu blive logget ud, log ind med din nye kode.'
          );
          signOut();
        })
        .catch((e) => {
          console.log(e);
        });
      return;
    } else {
      setError('koden er ikke ens');
      return;
    }
  };

  if (session.user.otp) {
    return (
      <>
        <Animate>
          <form className={login_styles.gentag_kode_container}>
            {error ? <h2>{error}</h2> : <h2>Ændre Koden</h2>}
            <input
              placeholder="Indtast ny kode"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              placeholder="Gentag koden"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Gem kode
            </button>
          </form>
        </Animate>
      </>
    );
  } else if (session.user.active == false) {
    return (
      <>
        <section className={frontpage_styles.container}>
          <h2>Du er logget ind</h2>
          <p>
            men du er ikke blevet aktiveret af en admin endnu, så du kan ikke se
            eller redigere noget.
          </p>
        </section>
      </>
    );
  }
};
Index.auth = true;
export default Index;
