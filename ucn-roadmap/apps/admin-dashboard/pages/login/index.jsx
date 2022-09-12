import React, { useState } from 'react';

import { getCsrfToken } from "next-auth/react"

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';



const Index = ({ csrfToken }) => {

    const [visibility, setVisibility] = useState(false)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleVisibility = () => {
        setVisibility(current => !current);
    }



    return (
        <>
            <form method="post" action="/api/auth/callback/credentials" className="login_container">
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <h2>Log ind</h2>
                <input placeholder="Email" name="user" type="email" value={email} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" onChange={e => setEmail(e.target.value)} />
                <div className="password_container">
                    <input placeholder="Adgangskode" name="password" minlength="8" type={visibility ? "text" : "Password"} value={password} onChange={e => setPassword(e.target.value)} />
                    <button onClick={handleVisibility}>
                        {visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </button>
                </div>



                <button type="submit"> Log på </button>
                <button className="sign_up_button"> eller, Tilmelde </button>
            </form>
        </>
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

