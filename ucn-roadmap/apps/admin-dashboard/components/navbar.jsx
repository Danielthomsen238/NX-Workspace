import LogoutIcon from '@mui/icons-material/Logout';
import Groups2Icon from '@mui/icons-material/Groups2';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import navbar_styles from '../src/styles/navbar.module.css';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  if (session.user.active && !session.user.hub) {
    return (
      <>
        <nav className={navbar_styles.nav}>
          <div className={navbar_styles.current_user_container}>
            <div>{session.user.firstname.charAt(0)}</div>
            <h2 className={navbar_styles.current_user_name}>
              {session.user.firstname}
            </h2>
          </div>
          <ul className={navbar_styles.droppedul}>
            <li>Menu</li>
            <li>
              <HomeIcon className={navbar_styles.icons} />
              <Link href="/">
                <a>Bruger Manual</a>
              </Link>
            </li>
            <li>
              <Groups2Icon className={navbar_styles.icons} />
              <Link href="/userList">
                <a>Brugere</a>
              </Link>
            </li>
            {session.user.role == 'Admin' ? (
              <li>
                <ApartmentIcon className={navbar_styles.icons} />
                <Link href="/schoolList">
                  <a>Skoler og Hubs</a>
                </Link>
              </li>
            ) : (
              <li>
                <ApartmentIcon className={navbar_styles.icons} />
                <Link href="/schoolList">
                  <a>Skole</a>
                </Link>
              </li>
            )}

            <li>
              <SchoolIcon className={navbar_styles.icons} />
              <Link href="/courseList">
                <a>Uddannelser</a>
              </Link>
            </li>
          </ul>
          <ul>
            <li onClick={() => signOut()}>
              <LogoutIcon className={navbar_styles.icons} />
              <a>Sign Out</a>
            </li>
          </ul>
        </nav>
      </>
    );
  } else if (session.user.active && session.user.hub) {
    return (
      <>
        <nav className={navbar_styles.nav}>
          <div className={navbar_styles.current_user_container}>
            <div>{session.user.firstname.charAt(0)}</div>
            <h2 className={navbar_styles.current_user_name}>
              {session.user.firstname}
            </h2>
          </div>
          <ul className={navbar_styles.droppedul}>
            <li>Menu</li>
            <li>
              <HomeIcon className={navbar_styles.icons} />
              <Link href="/">
                <a>Bruger Manual</a>
              </Link>
            </li>
            <li>
              <Groups2Icon className={navbar_styles.icons} />
              <Link href="/userList">
                <a>Brugere</a>
              </Link>
            </li>
            {session.user.role == 'Admin' ? (
              <li>
                <ApartmentIcon className={navbar_styles.icons} />
                <Link href="/schoolList">
                  <a>Skoler og Hubs</a>
                </Link>
              </li>
            ) : (
              <li>
                <ApartmentIcon className={navbar_styles.icons} />
                <Link href="/schoolList">
                  <a>Hub</a>
                </Link>
              </li>
            )}
          </ul>
          <ul>
            <li onClick={() => signOut()}>
              <LogoutIcon className={navbar_styles.icons} />
              <a>Sign Out</a>
            </li>
          </ul>
        </nav>
      </>
    );
  }
  if (!session.user.active) {
    return (
      <>
        <nav className={navbar_styles.nav}>
          <div className={navbar_styles.current_user_container}>
            <div>{session.user.firstname.charAt(0)}</div>
            <h2 className={navbar_styles.current_user_name}>
              {session.user.firstname}
            </h2>
          </div>
          <ul className={navbar_styles.droppedul}>
            <li>Admin</li>
            <li>
              <HomeIcon className={navbar_styles.icons} />
              <Link href="/">
                <a>Bruger Manual</a>
              </Link>
            </li>
            <li>
              <Groups2Icon className={navbar_styles.icons} />
              <a>Brugere</a>
            </li>
            <li>
              <ApartmentIcon className={navbar_styles.icons} />
              <a>Hub/Skole</a>
            </li>
          </ul>
          <ul>
            <li onClick={() => signOut()}>
              <LogoutIcon className={navbar_styles.icons} />
              <a>Sign Out</a>
            </li>
          </ul>
        </nav>
      </>
    );
  }
};

export default Navbar;
