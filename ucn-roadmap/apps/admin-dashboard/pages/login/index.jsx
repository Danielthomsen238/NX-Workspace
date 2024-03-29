import signUp_styles from '../../src/styles/signUp.module.css';
import login_styles from '../../src/styles/login.module.css';
import Geocode from 'react-geocode';
import UCNBackGround from '../../src/images/ucnbg.svg';
import { useState, useRef } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useRouter } from 'next/router';
import emailjs from 'emailjs-com';
import { getCsrfToken } from 'next-auth/react';
import UCNLogo from '../../src/images/ucnlogo.svg';

const Index = ({ csrfToken }) => {
  //body ref
  const container = useRef();
  //form ref
  const form = useRef();
  //router
  const router = useRouter();

  //button state
  const [waitButton, setWaitButton] = useState(false);
  //reset form
  const [resetEmail, setResetEmail] = useState('');
  const [resetTelefon, setResetTelefon] = useState('');
  //login form
  const [loginVisibility, setLoginVisibility] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  //bruger form
  const [firstVisibility, setFirstVisibility] = useState(false);
  const [secVisibility, setSecVisibility] = useState(false);
  const [email, setEmail] = useState();
  const [fornavn, setFornavn] = useState();
  const [efternavn, setEfternavn] = useState();
  const [telefon, setTelefon] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  //Skole form
  const [hub, setHub] = useState(false);
  const [startupCommunity, setStartupCommunity] = useState(false);
  const [skoleNavn, setSkoleNavn] = useState();
  const [address, setAddress] = useState();
  const [zip, setZip] = useState();
  const [city, setCity] = useState();
  const [skoleTelefon, setSkoleTelefon] = useState();
  const [skoleEmail, setSkoleEmail] = useState();
  const [beskrivelse, setBeskrivelse] = useState();
  //activ login form
  const [activeForm, setActiveForm] = useState(false);
  //submit data after converting address to lat and lng
  const handleSubmit = () => {
    Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API);
    Geocode.setLanguage('en');
    Geocode.setLocationType('ROOFTOP');
    setWaitButton(true);
    Geocode.fromAddress(`${address} ${zip} ${city}`).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        if (lat && lng) {
          submitSkole(lat, lng);
        }
      },
      (error) => {
        setWaitButton(false);
        console.error(error);
      }
    );
  };
  const submitSkole = (lat, lng) => {
    const data = {
      name: skoleNavn,
      address: address,
      zip: zip,
      city: city,
      hub: hub,
      start_up_community: startupCommunity,
      telefon: skoleTelefon,
      email: skoleEmail,
      description: beskrivelse,
      lat: lat,
      lng: lng,
    };
    axios
      .post('https://sequelize-roadmap.herokuapp.com/school', data)
      .then((response) => {
        submitUser(response.data.newId);
      })
      .catch((e) => {
        setWaitButton(false);
        console.log(e);
      });
  };

  const submitUser = (skoleId) => {
    const data = {
      firstname: fornavn,
      lastname: efternavn,
      telefon: telefon,
      email: email.toLowerCase(),
      password: password,
      school_id: skoleId,
    };
    axios
      .post('https://sequelize-roadmap.herokuapp.com/user', data)
      .then((response) => {
        sendEmail();
        router.push('/');
      })
      .catch((e) => {
        setWaitButton(false);
        console.log(e);
      });
  };
  //see/unsee the password
  const handleLoginVisibility = () => {
    setLoginVisibility((current) => !current);
  };
  const handleFirstVisibility = () => {
    setFirstVisibility((current) => !current);
  };
  const handleSecVisibility = () => {
    setSecVisibility((current) => !current);
  };

  //Emailjs
  const sendEmail = () => {
    emailjs
      .sendForm(
        'service_ix4m3zi',
        'template_t37n6ro',
        form.current,
        'qgJ7Ycqdm2BsAqhH7'
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  //Error handling
  // const error = router.query.error;
  //submit reset password
  const handleReset = (e) => {
    const payload = {
      username: resetEmail.toLowerCase(),
      telefon: resetTelefon,
    };
    axios
      .put(`https://sequelize-roadmap.herokuapp.com/reset`, payload)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <div ref={container} className={signUp_styles.body}>
        {/* OTP Login form */}

        <form
          method="post"
          action="/api/auth/callback/credentials"
          className={login_styles.login_container}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <UCNLogo />
          <h2>Engangs login</h2>
          <h3>
            Der er blevet sendt en mail med en engangskode, tjek spam om du har
            modtaget den.
          </h3>
          <input
            placeholder="Email"
            name="user"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <div className={login_styles.password_container}>
            <input
              placeholder="Adgangskode"
              name="otp"
              minLength="3"
              type={loginVisibility ? 'text' : 'Password'}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <div onClick={handleLoginVisibility}>
              {loginVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>
          <button type="submit"> Log på </button>
        </form>
        {/* Reset password */}
        <form
          className={login_styles.login_container}
          onSubmit={(e) => {
            e.preventDefault();
            handleReset();
            container.current.style.left = '33vw';
          }}
        >
          <UCNLogo />
          <h2>Reset Password</h2>
          <input
            placeholder="Email"
            name="user"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <input
            placeholder="Telefon"
            name="text"
            value={resetTelefon}
            onChange={(e) => setResetTelefon(e.target.value)}
            required
          />
          <button type="submit">Send Engangs kode</button>
        </form>
        {/* Login form */}
        {activeForm ? (
          <form className={login_styles.login_container}></form>
        ) : (
          <form
            method="post"
            action="/api/auth/callback/credentials"
            className={login_styles.login_container}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <UCNLogo />
            <h2>Log ind</h2>
            <input
              placeholder="Email"
              name="user"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <div className={login_styles.password_container}>
              <input
                placeholder="Adgangskode"
                name="password"
                minLength="3"
                type={loginVisibility ? 'text' : 'Password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <div onClick={handleLoginVisibility}>
                {loginVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </div>
            </div>
            <button type="submit"> Log på </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                container.current.style.left = '-205vw';
              }}
              className={login_styles.sign_up_button}
            >
              eller, Tilmeld
            </button>
            <button
              className={login_styles.resetBtn}
              onClick={(e) => {
                e.preventDefault();
                setActiveForm((state) => !state);
                container.current.style.left = '-49vw';
              }}
            >
              Glemt kode
            </button>
          </form>
        )}

        {/* Opret bruger form */}
        <form
          ref={form}
          className={signUp_styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            container.current.style.left = '-283vw';
          }}
        >
          <fieldset>
            <legend>Tilmeld Bruger</legend>
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
            <div className={signUp_styles.first_password_container}>
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
            <div className={signUp_styles.sec_password_container}>
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
          <div className={signUp_styles.button_container}>
            <button type="submit">Næste</button>
            <button
              onClick={(e) => {
                e.preventDefault();
                container.current.style.left = '-127vw';
              }}
              className={signUp_styles.back_button}
            >
              Tilbage
            </button>
          </div>
        </form>
        {/* Opret Skole form */}
        <form
          className={signUp_styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <fieldset>
            <legend>Tilmeld Skole Eller Hub</legend>
            <div className={signUp_styles.checkbox}>
              <label>Er en Hub?</label>
              <input
                className={signUp_styles.checkbox_hub}
                type="checkbox"
                defaultChecked={hub}
                onChange={() => setHub(!hub)}
              />
              <label>Har Startup community?</label>
              <input
                className={signUp_styles.checkbox_startup}
                type="checkbox"
                defaultChecked={startupCommunity}
                onChange={() => setStartupCommunity(!startupCommunity)}
              />
            </div>
            <input
              type="text"
              placeholder="Navn på Skolen/Hub"
              value={skoleNavn}
              onChange={(e) => setSkoleNavn(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Post nr."
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="By"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Telefon "
              value={skoleTelefon}
              onChange={(e) => setSkoleTelefon(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={skoleEmail}
              onChange={(e) => setSkoleEmail(e.target.value)}
              required
            />
            <div className={signUp_styles.text_container}>
              <textarea
                maxLength={1500}
                type="text"
                placeholder="Beskrivelse af skolen"
                value={beskrivelse}
                onChange={(e) => setBeskrivelse(e.target.value)}
              />
            </div>
          </fieldset>
          <div className={signUp_styles.button_container}>
            {waitButton ? (
              <button disabled type="button">
                Vent et øjeblik
              </button>
            ) : (
              <button type="submit">Opret</button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                container.current.style.left = '-205vw';
              }}
              className={signUp_styles.back_button}
            >
              Tilbage
            </button>
          </div>
        </form>
      </div>
      <UCNBackGround className={signUp_styles.background} />
    </>
  );
};

export const getServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default Index;
