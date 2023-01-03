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
  } else {
    return (
      <section className={frontpage_styles.guide}>
        <h1>Velkommen til Admin-Dashboard for Educational Roadmap.</h1>
        <p>
          Her vil du kunne oprette skoler, Hubs og startup communities, samt
          uddannelser som skal vises på det interaktive kort.
        </p>
        <h3>Hvad vil det sige, at min bruger er aktiveret?</h3>
        <p>
          Det betyder, at den skole, Hub eller Community din bruger er
          tilknyttet, vil blive vist på det interaktive kort, og du kan tilføje
          flere uddannelser til kortet, hvis du er tilknyttet en skole. Du vil
          også kunne oprette flere brugere til andre ansatte, som måske skal
          have mulighed for at rette noget.
        </p>
        <h3>Hvordan bruger jeg Dashboardet?</h3>
        <p>
          I venstre side kan du se menuen, som kan tage dig til de forskellige
          sider.
        </p>
        <h3>
          Hvordan opretter jeg flere brugere til min skole, Hub eller Startup
          community?
        </h3>
        <p>
          Du klikker på &quot;Brugere&quot; i menuen til venstre. Den vil føre
          dig til en liste med de nuværende brugere. I bunden kan du se en blå
          knap, hvor der står &quot;Opret bruger&quot; Hvis du klikker på den,
          vil du kunne oprette en eller flere brugere.
        </p>
        <h3>Er de brugere jeg opretter automatisk aktiveret?</h3>
        <p>
          Ja, når du først er blevet aktiveret, vil alle andre brugere du
          opretter automatisk være tilknyttet den skole, Hub eller Community du
          er fra, og de vil også være aktiveret og klar til brug.
        </p>
        <h3>
          Hvordan ændrer jeg en brugers information eller sletter en bruger?
        </h3>
        <p>
          Hvis du klikker på &quot;Brugere&quot; i venstre side, vil du komme
          til listen over alle brugere. I højre side af listen vil du kunne se 2
          ikoner: en blyant til at redigere en bruger, og en affaldsspand som
          sletter brugeren.
        </p>
        <h3>Hvordan ændrer jeg noget information omkring skolen/hubben?</h3>
        <p>
          Du klikker i venstre side på &quot;Skoler og Hubs&quot;, som vil føre
          dig til disses informationer. Her vil du kunne ændre tingene og
          tilføje et billede af skolen/hubben, som vil blive vist på det
          interaktive kort. Beskrivelse af skolen/hubben vil kun blive brugt,
          hvis der ikke er nogen uddannelse tilknyttet.
        </p>
        <h3>Hvordan opretter jeg en uddannelse?</h3>
        <p>
          Det er kun muligt at oprette uddannelser, hvis du er fra en skole. Du
          klikker i venstre side på &quot;Uddannelser&quot;, som vil føre dig
          til en liste over de nuværende uddannelser. I bunden er der en blå
          knap, hvor der står &quot;Opret uddannelse&quot;. Hvis du klikker på
          den, vil du kunne oprette en ny.
        </p>
        <h3>Hvordan redigerer eller sletter jeg en uddannelse?</h3>
        <p>
          Du klikker på &quot;Uddannelser&quot; i venstre side, som vil føre dig
          til listen over nuværende uddannelser. I højre side vil du kunne se 2
          ikoner: en blyant til at redigere uddannelsen og en affaldsspand til
          at slette uddannelsen.
        </p>
      </section>
    );
  }
};
Index.auth = true;
export default Index;
