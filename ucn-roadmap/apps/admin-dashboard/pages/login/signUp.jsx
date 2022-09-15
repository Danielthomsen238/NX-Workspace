import signUp_styles from '../../src/styles/signUp.module.css'
import Link from 'next/link';
import Geocode from "react-geocode";
import UCNBackGround from '../../src/images/ucnbg.svg'
import {useState} from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import {useRouter} from 'next/router';
import emailjs from 'emailjs-com'


const SignUp = () => {
    //router 
    const router = useRouter()
    //geocoding 
    const api = "AIzaSyCufVGqDojiQIsK6ndPvoxPJAWvPqG0_e0"
    //bruger form
    const [firstVisibility, setFirstVisibility] = useState(false)
    const [secVisibility, setSecVisibility] = useState(false)
    const [email, setEmail] = useState()
    const [fornavn, setFornavn] = useState()
    const [efternavn, setEfternavn] = useState()
    const [telefon, setTelefon] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    //Skole form
    const [skoleNavn, setSkoleNavn] = useState()
    const [address, setAddress] = useState()
    const [zip, setZip] = useState()
    const [city, setCity] = useState()
    const [skoleTelefon, setSkoleTelefon] = useState()
    const [skoleEmail, setSkoleEmail] = useState()
    const [beskrivelse, setBeskrivelse] = useState()

//submit data after converting address to lat and lng
  const handleSubmit = (e) => {
  e.preventDefault()  
  Geocode.setApiKey(api);
  Geocode.setLanguage("en");
  Geocode.setLocationType("ROOFTOP");
 
  Geocode.fromAddress(`${address} ${zip} ${city}`).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      if(lat && lng){
        submitSkole(lat, lng)
      }
      
    },
    (error) => {
      console.error(error);
    }
  )

} 
    const submitSkole = (lat, lng) => {
        const data = {
            name: skoleNavn,
            address: address,
            zip: zip,
            city: city,
            telefon: skoleTelefon,
            email: skoleEmail,
            description: beskrivelse,
            lat: lat,
            lng: lng
        }
            axios.post('http://localhost:4000/school', data)
            .then((response) => {
            submitUser(response.data.newId)
        })
        .catch((e) => { console.log(e)}
        )
    }

    const submitUser = (skoleId) => {
        const data = {
            firstname: fornavn,
            lastname: efternavn,
            telefon: telefon,
            email: email,
            password: password,
            school_id: skoleId
        }
            axios.post('http://localhost:4000/user', data)
            .then((response) => {
            router.push("/login")
        })
        .catch((e) => { console.log(e)}
        )
    }
//move the container on click next/back button
    const moveContainer = (e) => {
       e.preventDefault()
       let container = document.querySelector("#container")
       if(container.style.left == "35vw"){
        container.style.left = "-35vw"
       }else{
        container.style.left = "35vw"
       }
       
    }
//see/unsee the password
    const handleFirstVisibility = () => {
        setFirstVisibility(current => !current);
    }
    const handleSecVisibility = () => {
        setSecVisibility(current => !current);
    }

//Emailjs 
const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_USER_ID')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  }

    return (
        <>
    <div id="container" className={signUp_styles.body}>
        <form className={signUp_styles.form}>
            <fieldset>
                <legend>Tilmeld Bruger</legend>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="text" placeholder="Fornavn" value={fornavn} onChange={(e) => setFornavn(e.target.value)} />
                <input type="text" placeholder="Efternavn" value={efternavn} onChange={(e) => setEfternavn(e.target.value)} />
                <input type="text" placeholder="Telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)}/>
                <div className={signUp_styles.first_password_container}>
                <input placeholder="Adgangskode" name="password" minLength="3" type={firstVisibility ? "text" : "Password"} value={password} onChange={e => setPassword(e.target.value)} />
                    <div onClick={handleFirstVisibility}>
                        {firstVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </div>
                </div>
                <div className={signUp_styles.sec_password_container}>
                <input placeholder="Adgangskode" name="password" minLength="3" type={secVisibility ? "text" : "Password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <div onClick={handleSecVisibility}>
                        {secVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </div>
                </div>
            </fieldset>
            <div className={signUp_styles.button_container}>
            <button onClick={moveContainer}>Næste</button>
            <Link href="/login/"><button className={signUp_styles.back_button}>Tilbage</button></Link>
            </div>
            </form>
            <form className={signUp_styles.form}>
            <fieldset>
                <legend>Tilmeld Skole</legend>
                <input type="text" placeholder="Navn på skolen" value={skoleNavn} onChange={(e) => setSkoleNavn(e.target.value)} />
                <input type="text" placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input type="text" placeholder="Post nr" value={zip} onChange={(e) => setZip(e.target.value)}/>
                <input type="text" placeholder="By" value={city} onChange={(e) => setCity(e.target.value)} />
                <input type="text" placeholder="Telefon" value={skoleTelefon} onChange={(e) => setSkoleTelefon(e.target.value)}/>
                <input type="email" placeholder="Email" value={skoleEmail} onChange={(e) => setSkoleEmail(e.target.value)} />
                <textarea maxLength={1500} type="text" placeholder='Beskrivelse omkring skolen' value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} />
            </fieldset>
          <div className={signUp_styles.button_container}><button onClick={handleSubmit} on type="button">Opret Bruger og Skole</button><button onClick={moveContainer} className={signUp_styles.back_button}>Tilbage</button></div> 
        </form>

    </div>
    <UCNBackGround className={signUp_styles.background}/>
    </>
     );
}
 
export default SignUp;