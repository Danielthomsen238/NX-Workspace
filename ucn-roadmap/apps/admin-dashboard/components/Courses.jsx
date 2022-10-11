import courses_styles from '../src/styles/courses.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import AdminCourses from './AdminCourses';
import UserCourses from './UserCourses';
import Link from 'next/link';

const Courses = () => {
  const { data: session, status } = useSession();
  //runeffect for update
  const [runEffect, setRunEffect] = useState(false);
  //set data from api
  const [coursedata, setCourseData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  // fetch data
  useEffect(() => {
    axios
      .get('https://sequelize-roadmap.herokuapp.com/course')
      .then((response) => {
        console.log(response);
        setCourseData(response);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get('https://sequelize-roadmap.herokuapp.com/category')
      .then((response) => {
        console.log(response);
        setCategoryData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [runEffect]);

  if (session.user.role == 'Admin') {
    return (
      <div className={courses_styles.container}>
        <div className={courses_styles.body}>
          <table className={courses_styles.table}>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Beskrivelse</th>
                <th>Varighed</th>
                <th>Skole Navn</th>
                <th>Kategori</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody>
              <AdminCourses
                runEffect={setRunEffect}
                categoryData={categoryData}
                courseData={coursedata}
              />
            </tbody>
          </table>
        </div>
        <Link href="/createCourse">
          <button className={courses_styles.button}>Opret Uddannelse</button>
        </Link>
      </div>
    );
  } else if (session.user.role == 'User') {
    return (
      <div className={courses_styles.container}>
        <div className={courses_styles.body}>
          <table className={courses_styles.table}>
            <thead>
              <tr>
                <th>id</th>
                <th>Navn</th>
                <th>Beskrivelse</th>
                <th>Varighed</th>
                <th>Kategori</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <UserCourses
                runEffect={setRunEffect}
                categoryData={categoryData}
                courseData={coursedata}
              />
            </tbody>
          </table>
        </div>
        <Link href="/createCourse">
          <button className={courses_styles.button}>Opret Uddannelse</button>
        </Link>
      </div>
    );
  }
};

export default Courses;
