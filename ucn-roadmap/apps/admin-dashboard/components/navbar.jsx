import LogoutIcon from '@mui/icons-material/Logout';
import Groups2Icon from '@mui/icons-material/Groups2';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SchoolIcon from '@mui/icons-material/School';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Link from 'next/link';
import navbar_styles from '../src/styles/navbar.module.css';

import { useSession } from 'next-auth/react';

import { useState } from 'react';

import { signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session, status } = useSession();

  const [isDroppedUp, setIsDroppedUp] = useState(false);

  const handleDropUp = (event) => {
    setIsDroppedUp((current) => !current);
  };

  return (
    <>
      <nav className={navbar_styles.nav}>
        <div className={navbar_styles.current_user_container}>
          <div />
          <h2 className={navbar_styles.current_user_name}>
            {session.user.firstname}
          </h2>
          <p className={navbar_styles.current_user_school}>
            {session.user.username}
          </p>
        </div>
        <ul
          className={
            isDroppedUp ? navbar_styles.notdropped : navbar_styles.droppedul
          }
        >
          <li>
            Admin
            <ArrowDropUpIcon
              className={
                isDroppedUp ? navbar_styles.dropped : navbar_styles.arrows
              }
              onClick={handleDropUp}
            />
          </li>
          {session.user.active ? (
            <li>
              <Groups2Icon className={navbar_styles.icons} />
              <Link href="/userList">
                <a>Users</a>
              </Link>
            </li>
          ) : (
            <li>
              <Groups2Icon className={navbar_styles.icons} />
              <a>Users</a>
            </li>
          )}
          {session.user.active ? (
            <li>
              <ApartmentIcon className={navbar_styles.icons} />
              <Link href="/schoolList">
                <a>Schools</a>
              </Link>
            </li>
          ) : (
            <li>
              <ApartmentIcon className={navbar_styles.icons} />
              <a>Schools</a>
            </li>
          )}
          {session.user.active ? (
            <li>
              <SchoolIcon className={navbar_styles.icons} />{' '}
              <Link href="/courseList">
                <a>Courses</a>
              </Link>
            </li>
          ) : (
            <li>
              <SchoolIcon className={navbar_styles.icons} />
              <a>Courses</a>
            </li>
          )}
          {session.user.active ? (
            <li>
              <ListIcon className={navbar_styles.icons} />
              <Link href="/categories">
                <a>Categories</a>
              </Link>
            </li>
          ) : (
            <li>
              <ListIcon className={navbar_styles.icons} />
              <a>Categories</a>
            </li>
          )}
        </ul>
        <ul>
          <li>User</li>
          <li>
            <SettingsIcon className={navbar_styles.icons} /> Settings
          </li>
          <li onClick={() => signOut()}>
            <LogoutIcon className={navbar_styles.icons} />
            <a>Sign Out</a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
