import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import school_styles from '../src/styles/school.module.css';
import Geocode from 'react-geocode';
import user_styles from '../src/styles/user.module.css';
import { useRouter } from 'next/router';

const AdminCourses = (props) => {
  const router = useRouter();
  //destruct data from props
  const { courseData, categoryData, runEffect } = props;
  //get user session
  const { data: session, status } = useSession();
  //usestates for inputs
  const [name, setName] = useState();
  const [courseId, setCourseId] = useState();
  const [description, setDescription] = useState();
  const [duration, setDuration] = useState();
  const [addresse, setAddresse] = useState();
  const [zip, setZip] = useState();
  const [city, setCity] = useState();
  const [categoryName, setCategoryName] = useState();
  const [itemClicked, setItemClicked] = useState();

  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };
  const handleGeo = () => {
    Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API);
    Geocode.setLanguage('en');
    Geocode.setLocationType('ROOFTOP');
    Geocode.fromAddress(`${addresse} ${zip} ${city}`).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        if (lat && lng) {
          handleCategoryID(lat, lng);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };
  const handleCategoryID = (lat, lng) => {
    const data = {
      title: categoryName,
    };

    axios
      .post('https://sequelize-roadmap.herokuapp.com/categoryId', data)
      .then((response) => {
        handleSubmit(response.data.id, lat, lng);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = (categoryid, lat, lng) => {
    const data = {
      id: courseId,
      name: name,
      description: description,
      duration: duration,
      school_id: session.user.school_id,
      category_id: categoryid,
      address: addresse,
      city: city,
      zip: zip,
      lat: lat,
      lng: lng,
    };
    console.log(data);
    axios
      .put('https://sequelize-roadmap.herokuapp.com/course', data, config)
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
    setCategoryName();
    setAddresse();
    setCity();
    setZip();
    setCourseId();
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
                disabled={itemClicked == course.id ? '' : 'disabled'}
                value={itemClicked == course.id ? addresse : course.address}
                onChange={(e) => setAddresse(e.target.value)}
                type="text"
              />
            </td>
            <td>
              <input
                disabled={itemClicked == course.id ? '' : 'disabled'}
                value={itemClicked == course.id ? zip : course.zip}
                onChange={(e) => setZip(e.target.value)}
                type="text"
              />
            </td>
            <td>
              <input
                disabled={itemClicked == course.id ? '' : 'disabled'}
                value={itemClicked == course.id ? city : course.city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
              />
            </td>
            <td
              className={
                itemClicked == course.id
                  ? school_styles.readable
                  : school_styles.collapsed
              }
            >
              <textarea
                disabled={itemClicked == course.id ? '' : 'disabled'}
                value={
                  itemClicked == course.id ? description : course.description
                }
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
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
                    onClick={router.push(`/courses/${itemClicked}`)}
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
                      setCourseId(course.id);
                      setName(course.name);
                      setDescription(course.description);
                      setDuration(course.duration);
                      setAddresse(course.address);
                      setCategoryName(course.category.title);
                      setCity(course.city);
                      setZip(course.zip);
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
