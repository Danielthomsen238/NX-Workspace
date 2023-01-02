import { useSession } from 'next-auth/react';
import { useState } from 'react';
import singleSchool_styles from '../../src/styles/singleSchool.module.css';
import Geocode from 'react-geocode';
import school_styles from '../../src/styles/school.module.css';
import axios from 'axios';
import Animate from '../../components/Animate';

export async function getServerSideProps(context) {
  const id = context.params.id;
  try {
    const result = await axios.get(
      `https://sequelize-roadmap.herokuapp.com/school/${id}`
    );
    const data = result.data;
    console.log(data);
    return {
      props: {
        school: data,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

const SchoolDetails = ({ school }) => {
  const { data: session, status } = useSession();
  const [schoolName, setSchoolName] = useState(school.name);
  const [schoolPhone, setSchoolPhone] = useState(school.telefon);
  const [schoolEmail, setSchoolEmail] = useState(school.email);
  const [schoolImage, setSchoolImage] = useState(school.image);
  const [schoolAddresse, setSchoolAddresse] = useState(school.address);
  const [schoolZip, setSchoolZip] = useState(school.zip);
  const [schoolCity, setSchoolCity] = useState(school.city);
  const [schoolContent, setSchoolContent] = useState(school.description);
  const [itemClicked, setItemClicked] = useState();
  let GeneratedImageUrl;

  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };
  const HandleCancel = (e) => {
    setItemClicked(e.target.className);
    setSchoolName(school.name);
    setSchoolPhone(school.telefon);
    setSchoolEmail(school.email);
    setSchoolImage(school.image);
    setSchoolAddresse(school.address);
    setSchoolZip(school.zip);
    setSchoolCity(school.city);
    setSchoolContent(school.description);
  };
  const handleSubmit = (e) => {
    Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API);
    Geocode.setLanguage('en');
    Geocode.setLocationType('ROOFTOP');
    Geocode.fromAddress(`${schoolAddresse} ${schoolZip} ${schoolCity}`).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        if (lat && lng) {
          submitSkoleEdit(lat, lng);
        }
      },
      (error) => {
        console.error(error);
      }
    );

    const submitSkoleEdit = (lat, lng) => {
      const payload = {
        id: parseInt(itemClicked),
        name: schoolName,
        address: schoolAddresse,
        zip: schoolZip,
        city: schoolCity,
        telefon: schoolPhone,
        email: schoolEmail,
        description: schoolContent,
        image: schoolImage,
        lat: lat,
        lng: lng,
      };
      axios
        .put(`https://sequelize-roadmap.herokuapp.com/school`, payload, config)
        .then((response) => {
          console.log(response);
          setItemClicked(false);
        })
        .catch((e) => {
          console.log(e);
        });
    };
  };

  //function that makes editing true
  const HandleEdit = (e) => {
    setItemClicked(e.target.className);
  };

  const fileSelectedHandler = (event) => {
    const formdata = new FormData();
    formdata.append('image', event.target.files[0]);
    fetch('https://api.imgur.com/3/image/', {
      method: 'post',
      headers: {
        Authorization: 'Client-ID d4e7ab1dc021147',
      },
      body: formdata,
    })
      .then((data) => data.json())
      .then((data) => {
        sessionStorage.setItem('ImageToPost', data.data.link);
        console.log(data);
        if (data.data.link) {
          GeneratedImageUrl = data.data.link;
        } else {
          GeneratedImageUrl = schoolImage;
        }
        console.log(GeneratedImageUrl);
        setSchoolImage(GeneratedImageUrl);
      });
  };
  return (
    <Animate>
      <div className={singleSchool_styles.body}>
        <div className={singleSchool_styles.ImageContainer}>
          <img
            src={schoolImage}
            onChange={(e) => setSchoolImage(e.target.value)}
            alt=""
            layout="fill"
          />
          <div className={singleSchool_styles.imgEdit}>
            <label
              className={singleSchool_styles.files}
              htmlFor={itemClicked == school.id ? 'files' : ''}
            >
              Opdater billede
            </label>
            <input type="file" id="files" onChange={fileSelectedHandler} />
          </div>
        </div>
        <div className={singleSchool_styles.InputContainer}>
          <br></br>
          <label htmlFor="name">Navn</label>
          <input
            className={
              itemClicked == school.id ? '' : singleSchool_styles.disabled
            }
            id="name"
            type="text"
            disabled={itemClicked == school.id ? '' : 'disabled'}
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
          <label htmlFor="phone">Telefon</label>
          <input
            className={
              itemClicked == school.id ? '' : singleSchool_styles.disabled
            }
            disabled={itemClicked == school.id ? '' : 'disabled'}
            value={schoolPhone}
            onChange={(e) => setSchoolPhone(e.target.value)}
            type="number"
          />
          <label htmlFor="email">Email</label>
          <input
            className={
              itemClicked == school.id ? '' : singleSchool_styles.disabled
            }
            disabled={itemClicked == school.id ? '' : 'disabled'}
            value={schoolEmail}
            onChange={(e) => setSchoolEmail(e.target.value)}
            type="text"
          />
          <label htmlFor="Adresse">Adresse</label>
          <input
            className={
              itemClicked == school.id ? '' : singleSchool_styles.disabled
            }
            disabled={itemClicked == school.id ? '' : 'disabled'}
            value={schoolAddresse}
            onChange={(e) => setSchoolAddresse(e.target.value)}
            type="text"
          />
          <label htmlFor="Zip">Zip</label>
          <input
            className={
              itemClicked == school.id ? '' : singleSchool_styles.disabled
            }
            disabled={itemClicked == school.id ? '' : 'disabled'}
            value={schoolZip}
            onChange={(e) => setSchoolZip(e.target.value)}
            type="text"
          />
          <label htmlFor="City">By</label>
          <input
            className={
              itemClicked == school.id ? '' : singleSchool_styles.disabled
            }
            disabled={itemClicked == school.id ? '' : 'disabled'}
            value={schoolCity}
            onChange={(e) => setSchoolCity(e.target.value)}
            type="text"
          />
          <label htmlFor="Beskrivelse">Beskrivelse</label>
          <textarea
            className={
              itemClicked == school.id ? '' : singleSchool_styles.disabled
            }
            disabled={itemClicked == school.id ? '' : 'disabled'}
            value={schoolContent}
            onChange={(e) => setSchoolContent(e.target.value)}
          ></textarea>
        </div>
        <div className={singleSchool_styles.ButtonsContainer}>
          <button
            className={school_styles.icon}
            onClick={(e) => handleSubmit(e)}
          >
            Gem ændringer
          </button>{' '}
          {itemClicked == school.id ? (
            <button className={school_styles.icon} onClick={HandleCancel}>
              Fortryd
            </button>
          ) : (
            <button
              className={school.id}
              onClick={(e) => {
                HandleEdit(e);
              }}
            >
              Rediger
            </button>
          )}
        </div>
      </div>
    </Animate>
  );
};
SchoolDetails.auth = true;
export default SchoolDetails;
