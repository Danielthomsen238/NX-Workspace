import { useState, useEffect } from 'react';
import axios from 'axios';
import courses_styles from '../src/styles/courses.module.css';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const CreateCourse = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categoryData, setCategoryData] = useState([]);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [duration, setDuration] = useState();
  const [categoryName, setCategoryName] = useState();

  const payload = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };

  useEffect(() => {
    axios
      .get('https://sequelize-roadmap.herokuapp.com/category')
      .then((response) => {
        console.log(response);
        setCategoryData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleCategoryID = () => {
    const data = {
      title: categoryName,
    };

    axios
      .post('https://sequelize-roadmap.herokuapp.com/categoryId', data)
      .then((response) => {
        handleSubmit(response.data.id);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = (categoryid) => {
    const data = {
      name: name,
      description: description,
      duration: duration,
      school_id: session.user.school_id,
      category_id: categoryid,
    };
    axios
      .post('https://sequelize-roadmap.herokuapp.com/course', data, payload)
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className={courses_styles.form_container}>
      <form className={courses_styles.form}>
        <input
          placeholder="Navn på Uddannelse"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Varighed på uddannelse"
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <select
          name="Category"
          value={categoryName}
          onChange={(e) => {
            console.log(e.target);
            setCategoryName(e.target.value);
          }}
        >
          <option value="" disabled selected hidden>
            Vælge Kategori
          </option>
          {categoryData.data?.map((category, idx) => {
            return (
              <option key={idx} value={category.title}>
                {category.title}
              </option>
            );
          })}
        </select>
        <textarea
          placeholder="Beskrivelse"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
      <button
        className={courses_styles.button}
        onClick={(e) => {
          e.preventDefault();
          handleCategoryID();
        }}
      >
        Opret Uddannelse
      </button>
    </div>
  );
};
CreateCourse.auth = true;
export default CreateCourse;
