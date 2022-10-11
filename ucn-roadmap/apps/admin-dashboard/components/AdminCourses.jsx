import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import user_styles from '../src/styles/user.module.css';

const AdminCourses = (props) => {
  //destruct data from props
  const { courseData, categoryData, runEffect } = props;
  //get user session
  const { data: session, status } = useSession();
  //usestates for inputs
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [duration, setDuration] = useState();
  const [schoolName, setSchoolName] = useState();
  const [categoryName, setCategoryName] = useState();
  const [itemClicked, setItemClicked] = useState();

  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };
  const getCategoryId = () => {
    const payload = {
      title: categoryName,
    };
    axios
      .post(`https://sequelize-roadmap.herokuapp.com/categoryId`, payload)
      .then((response) => {
        console.log(response);
        handleSubmit(response.data.id);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleSubmit = (id) => {
    const payload = {
      id: itemClicked,
      name: name,
      description: description,
      duration: duration,
      category_id: id,
    };
    axios
      .put(`https://sequelize-roadmap.herokuapp.com/course`, payload, config)
      .then((response) => {
        console.log(response);
        runEffect((state) => !state);
        setItemClicked(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //function that makes editing true
  const HandleEdit = (e) => {
    setItemClicked(e.target.className);
  };
  //function to cancel the editing
  const HandleCancel = (e) => {
    setItemClicked(e.target.className);
    setName();
    setDescription();
    setDuration();
    setSchoolName();
    setCategoryName();
  };

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
          setItemClicked(false);
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
  console.log(courseData.data);
  return (
    <>
      {courseData.data?.map((course, idx) => {
        return (
          <tr key={idx}>
            <td>
              <input
                type="text"
                disabled={itemClicked == course.id ? '' : 'disabled'}
                value={itemClicked == course.id ? name : course.name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                disabled={itemClicked == course.id ? '' : 'disabled'}
                value={
                  itemClicked == course.id ? description : course.description
                }
                onChange={(e) => setDescription(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                disabled={itemClicked == course.id ? '' : 'disabled'}
                value={itemClicked == course.id ? duration : course.duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </td>
            <td>{course.school.name}</td>
            <td>
              <select
                name="Category"
                disabled={itemClicked == course.id ? null : true}
                value={
                  itemClicked == course.id
                    ? categoryName
                    : course.category.title
                }
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
              >
                <option value={course.category.title}>
                  {course.category.title}
                </option>
                {categoryData.data?.map((category, idx) => {
                  return (
                    <>
                      {category.title != course.category.title ? (
                        <option value={category.title}>{category.title}</option>
                      ) : (
                        <> </>
                      )}
                    </>
                  );
                })}
              </select>
            </td>
            <td>
              {itemClicked == course.id ? (
                <button>
                  <CheckIcon
                    className={user_styles.icon}
                    onClick={getCategoryId}
                  />
                  <ClearIcon
                    className={user_styles.icon}
                    onClick={HandleCancel}
                  />
                </button>
              ) : (
                <div className={user_styles.OverButton}>
                  <button
                    className={course.id}
                    onClick={(e) => {
                      HandleEdit(e);
                      setName(course.name);
                      setDescription(course.description);
                      setDuration(course.duration);
                    }}
                  ></button>
                  <EditIcon className={user_styles.icon} />
                </div>
              )}
              <div className={user_styles.OverButton}>
                <button id={course.id} onClick={DeleteData}></button>
                <DeleteForeverIcon className={user_styles.icon} />
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default AdminCourses;
