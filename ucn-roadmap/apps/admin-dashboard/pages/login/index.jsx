import { useState } from 'react';
import Link from 'next/link';
import { getCsrfToken } from "next-auth/react"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UCNLogo from '../../src/images/ucnlogo.svg'
import UCNBackGround from '../../src/images/ucnbg.svg'
import login_styles from '../../src/styles/login.module.css'



const Index = ({ csrfToken }) => {

    const [visibility, setVisibility] = useState(false)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleVisibility = () => {
        setVisibility(current => !current);
    }



    return (
        <div className={login_styles.body}>
            <form method="post" action="/api/auth/callback/credentials" className={login_styles.login_container}>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <UCNLogo />
                <h2>Log ind</h2>
                <input placeholder="Email" name="user" type="email" value={email} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" onChange={e => setEmail(e.target.value)} />
                <div className={login_styles.password_container}>
                    <input placeholder="Adgangskode" name="password" minLength="3" type={visibility ? "text" : "Password"} value={password} onChange={e => setPassword(e.target.value)} />
                    <div onClick={handleVisibility}>
                        {visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </div>
                </div>



                <button type="submit"> Log på </button>
                
               <Link href="/login/signUp"><button className={login_styles.sign_up_button}> eller, Tilmelde </button></Link>
            </form>
            <UCNBackGround className={login_styles.background}/>
        </div>
    );
}

export const getServerSideProps = async (context) => {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
};

export default Index;

