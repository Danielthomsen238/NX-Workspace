import axios from 'axios';
import { useState, useEffect } from 'react';
import courses_styles from '../../src/styles/courses.module.css';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Geocode from 'react-geocode';

export const getStaticPaths = async () => {
  try {
    const result = await axios.get(`http://localhost:3123/course`);
    const data = result.data;
    console.log(data);
    const paths = data?.map((course) => {
      return {
        params: { id: course.id.toString() },
      };
    });
    return {
      paths: paths,
      fallback: false,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  try {
    const result = await axios.get(`http://localhost:3123/course/${id}`);
    const data = result.data;
    console.log(data);
    return {
      props: {
        course: data,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

const CourseDetail = ({ course }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categoryData, setCategoryData] = useState([]);
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);
  const [address, setAddress] = useState(course.address);
  const [zip, setZip] = useState(course.zip);
  const [city, setCity] = useState(course.city);
  const [duration, setDuration] = useState(course.duration);
  const [categoryName, setCategoryName] = useState(course.categoryName);

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

  const handleGeo = () => {
    Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API);
    Geocode.setLanguage('en');
    Geocode.setLocationType('ROOFTOP');
    Geocode.fromAddress(`${address} ${zip} ${city}`).then(
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
      name: name,
      description: description,
      duration: duration,
      school_id: session.user.school_id,
      category_id: categoryid,
      address: address,
      city: city,
      zip: zip,
      lat: lat,
      lng: lng,
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
        <fieldset>
          <legend>Opdatere Uddannelse</legend>
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
          <input
            type="text"
            placeholder="Adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Post nr."
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          <input
            type="text"
            placeholder="By"
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
        </fieldset>
      </form>
      <button
        className={courses_styles.button}
        onClick={() => {
          handleGeo();
        }}
      >
        Opret Uddannelse
      </button>
    </div>
  );
};
CourseDetail.auth = true;
export default CourseDetail;
