import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import user_styles from '../src/styles/user.module.css';

const UserCourses = (props) => {
  const router = useRouter();
  //destruct data from props
  const { courseData, runEffect } = props;
  //get user session
  const { data: session, status } = useSession();

  //function(not done) to delete user
  const DeleteData = (e) => {
    let person = prompt('Please confirm by typing, "DELETE"');
    if (person == 'DELETE') {
      const payload = {
        headers: { authorization: `Bearer ${session?.user.token}` },
        data: { id: e.target.id },
      };
      axios
        .delete(`https://sequelize-roadmap.herokuapp.com/course`, payload)
        .then((response) => {
          console.log(response);
          runEffect((state) => !state);
        })
        .catch((e) => {
          console.log(e);
        });

      alert('Deleted');
    } else if (person !== 'DELETE' && person !== null) {
      alert('du tastede forkert');
      return;
    } else {
      return;
    }
  };

  return (
    <>
      {courseData.data?.map((course, idx) => {
        if (session.user.school_id == course.school.id) {
          return (
            <tr key={idx}>
              <td>{course.name}</td>
              <td>{course.address}</td>
              <td>{course.zip}</td>
              <td>{course.city}</td>
              <td>
                <div>{course.description}</div>
              </td>
              <td>{course.duration}</td>
              <td>{course.category.title}</td>
              <td>
                <button>
                  <EditIcon
                    className={user_styles.icon}
                    onClick={() => router.push(`/courses/${course.id}`)}
                  />
                </button>

                <div className={user_styles.OverButton}>
                  <button id={course.id} onClick={DeleteData}></button>
                  <DeleteForeverIcon className={user_styles.icon} />
                </div>
              </td>
            </tr>
          );
        }
      })}
    </>
  );
};

export default UserCourses;
