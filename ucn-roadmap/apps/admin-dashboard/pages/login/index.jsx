import React, { useState } from 'react';


import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Index = () => {

    const [visibility, setVisibility] = useState(false)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleVisibility = () => {
        setVisibility(current => !current);
    }



    return (
        <>
            <form className="login_container">
                <h2>Log ind</h2>
                <input placeholder="Email" type="email" value={email} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" onChange={e => setEmail(e.target.value)} />
                <div className="password_container">
                    <input placeholder="Adgangskode" minlength="8" type={visibility ? "text" : "Password"} value={password} onChange={e => setPassword(e.target.value)} />
                    <button onClick={handleVisibility}>
                        {visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </button>
                </div>



                <button> Log på </button>
                <button className="sign_up_button"> eller, Tilmelde </button>
            </form>
        </>
    );
}

export default Index;