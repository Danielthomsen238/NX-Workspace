import { useState } from 'react';
import { useRouter } from 'next/router';
import createUse_styles from '../src/styles/createUser.module.css';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CreateUser = () => {
  //session data
  const { data: session, status } = useSession();
  //button clicked
  const [buttonClicked, setButtonClicked] = useState(false);
  //router
  const router = useRouter();
  //form data
  const [firstVisibility, setFirstVisibility] = useState(false);
  const [secVisibility, setSecVisibility] = useState(false);
  const [email, setEmail] = useState();
  const [fornavn, setFornavn] = useState();
  const [efternavn, setEfternavn] = useState();
  const [telefon, setTelefon] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  //reRoute if user is not active
  if (!session.user.active) {
    router.push('/');
  }
  //see password
  const handleFirstVisibility = () => {
    setFirstVisibility((current) => !current);
  };
  const handleSecVisibility = () => {
    setSecVisibility((current) => !current);
  };
  //submit user
  const submitUser = () => {
    const data = {
      firstname: fornavn,
      lastname: efternavn,
      telefon: telefon,
      email: email,
      password: password,
      active: true,
      school_id: session.user.school_id,
    };
    axios
      .post('https://sequelize-roadmap.herokuapp.com/user', data)
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          router.push('/userList');
        }, 1000);
      })
      .catch((e) => {
        setButtonClicked((state) => !state);
        console.log(e);
      });
  };
  return (
    <div className={createUse_styles.body}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setButtonClicked((state) => !state);
          submitUser();
        }}
        className={createUse_styles.form}
      >
        <fieldset>
          <legend>Opret Bruger</legend>
          <input
            type="text"
            name="user_email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            name="user_firstname"
            placeholder="Fornavn"
            value={fornavn}
            onChange={(e) => setFornavn(e.target.value)}
            required
          />
          <input
            type="text"
            name="user_lastname"
            placeholder="Efternavn"
            value={efternavn}
            onChange={(e) => setEfternavn(e.target.value)}
            required
          />
          <input
            type="text"
            name="user_phone"
            placeholder="Telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            required
          />
          <div className={createUse_styles.first_password_container}>
            <input
              placeholder="Adgangskode"
              name="password"
              minLength="3"
              type={firstVisibility ? 'text' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div onClick={handleFirstVisibility}>
              {firstVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>
          <div className={createUse_styles.sec_password_container}>
            <input
              placeholder="Adgangskode"
              name="password"
              minLength="3"
              type={secVisibility ? 'text' : 'Password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div onClick={handleSecVisibility}>
              {secVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>
        </fieldset>
        <div className={createUse_styles.button_container}>
          {buttonClicked ? (
            <button>Vent et øjeblik</button>
          ) : (
            <button type="submit">Opret Bruger</button>
          )}
        </div>
      </form>
    </div>
  );
};
CreateUser.auth = true;
export default CreateUser;
