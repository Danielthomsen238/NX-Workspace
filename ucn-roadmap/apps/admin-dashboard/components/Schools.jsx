import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Geocode from 'react-geocode';
import { useRef } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import school_styles from '../src/styles/school.module.css';

const Schools = () => {
  //States for user changes

  //geocoding
  const api = 'AIzaSyCufVGqDojiQIsK6ndPvoxPJAWvPqG0_e0';

  const { data: session, status } = useSession();
  const [waitButton, setWaitButton] = useState(false);
  const [runEffect, setRunEffect] = useState(false);
  const [schoolName, setSchoolName] = useState();
  const [schoolPhone, setSchoolPhone] = useState();
  const [schoolEmail, setSchoolEmail] = useState();
  const [schoolImage, setSchoolImage] = useState();
  const [schoolAddresse, setSchoolAddresse] = useState();
  const [schoolZip, setSchoolZip] = useState();
  const [schoolCity, setSchoolCity] = useState();
  const [schoolContent, setSchoolContent] = useState();
  const [itemClicked, setItemClicked] = useState();
  const [schoolData, setData] = useState();
  let GeneratedImageUrl;
  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };



  // Handel selected file for upload
  const fileSelectedHandler = event => {
    const formdata = new FormData()
    formdata.append("image", event.target.files[0])
    fetch("https://api.imgur.com/3/upload/", {
      method: "post",
      headers: {
        Authorization: "Client-ID 1b600c51c02423d"
      },
      body: formdata
    }).then(data => data.json()).then(data => {
      sessionStorage.setItem('ImageToPost', data.data.link);
      if (data.data.link) {

        GeneratedImageUrl = data.data.link

      }
      else {

        GeneratedImageUrl = schoolImage

      }
      setSchoolImage(GeneratedImageUrl)
    })
  }

  //fetch data
  useEffect(() => {
    axios
      .get('https://sequelize-api.vercel.app/School', config)
      .then((response) => {
        console.log(response);
        setData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [runEffect]);

  //submit function to update school
  const handleSubmit = (e) => {
    e.preventDefault();
    Geocode.setApiKey(api);
    Geocode.setLanguage('en');
    Geocode.setLocationType('ROOFTOP');
    setWaitButton(true);
    Geocode.fromAddress(`${schoolAddresse} ${schoolZip} ${schoolCity}`).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        if (lat && lng) {
          submitSkoleEdit(lat, lng);
        }
      },
      (error) => {
        setWaitButton(false);
        console.error(error);
      }
    );
    const submitSkoleEdit = (lat, lng) => {
      const payload = {
        id: itemClicked,
        name: schoolName,
        address: schoolAddresse,
        zip: schoolZip,
        city: schoolCity,
        telefon: schoolPhone,
        email: schoolEmail,
        description: schoolContent,
        image: schoolImage,
        lat: lat,
        lng: lng
      };
      axios
        .put(`https://sequelize-api.vercel.app/school`, payload, config)
        .then((e, response) => {
          console.log(response);
          setRunEffect((state) => !state);
          setItemClicked(false);
        })
        .catch((e) => {
          console.log(e);
        });
      console.log("Payload", payload);
    };
  };

  //function that makes editing true
  const HandleEdit = (e) => {
    setItemClicked(e.target.className);
  };

  //function to cancel the editing
  const HandleCancel = (e) => {
    setItemClicked(e.target.className);
    setSchoolName();
    setSchoolPhone();
    setSchoolEmail();
    setSchoolImage();
    setSchoolAddresse();
    setSchoolZip();
    setSchoolCity();
    setSchoolContent();
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
        .delete(`https://sequelize-api.vercel.app/School`, payload)
        .then((response) => {
          console.log(response);
          setRunEffect((state) => !state);
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

  //function for select/options for activ user
  const Other = (X) => {
    return !X;
  };

  //function to set the initial value of states if states is undefined on user clicked for editing
  const setInitaleValue = (
    name,
    telefon,
    email,
    image,
    address,
    zip,
    city,
    content,
    schoolid
  ) => {
    if (!schoolName) {
      setSchoolName(name);
    }
    if (!schoolPhone) {
      setSchoolPhone(telefon);
    }
    if (!schoolEmail) {
      setSchoolEmail(email);
    }
    if (!schoolImage) {
      setSchoolImage(image);
    }
    if (!schoolAddresse) {
      setSchoolAddresse(address);
    }
    if (!schoolZip) {
      setSchoolZip(zip);
    }
    if (!schoolCity) {
      setSchoolCity(city);
    }
    if (!schoolContent) {
      setSchoolContent(content);
    }
    console.log(schoolid, itemClicked)
  };
  //Admin jsx (only admin can see this)
  if (session.user.role != 'Admin') {
    return (
      <>
        <div className={school_styles.body}>
          <table className={school_styles.table}>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Billede</th>
                <th>Adresse</th>
                <th>Zip</th>
                <th>By</th>
                <th>Om os</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schoolData?.data.map((school, idx) => {
                return (
                  <tr
                    key={idx}>
                    <td><input value={school.name} type="text" disabled={itemClicked == school.id ? '' : 'disabled'}
                      value={
                        itemClicked == school.id
                          ? schoolName
                          : school.name
                      }
                      onChange={(e) => setSchoolName(e.target.value)}
                    /></td>
                    <td><input disabled={itemClicked == school.id ? '' : 'disabled'} value={itemClicked == school.id ? schoolPhone : school.telefon} onChange={(e) => setSchoolPhone(e.target.value)} type="number" /></td>
                    <td><input disabled={itemClicked == school.id ? '' : 'disabled'} value={itemClicked == school.id ? schoolEmail : school.email} onChange={(e) => setSchoolEmail(e.target.value)} type="text" /></td>
                    <td> <a target="_blank" href={itemClicked == school.id ? schoolImage : school.image} onChange={(e) => setSchoolImage(e.target.value)}><input type="text" disabled={itemClicked == school.id ? '' : 'disabled'} value={itemClicked == school.id ? schoolImage : school.image} onChange={(e) => setSchoolImage(e.target.value)} /></a>  <input disabled={itemClicked == school.id ? '' : 'disabled'} type="file" onClick={fileSelectedHandler} />
                    </td>
                    <td><input disabled={itemClicked == school.id ? '' : 'disabled'} value={itemClicked == school.id ? schoolAddresse : school.address} onChange={(e) => setSchoolAddresse(e.target.value)} type="text" /></td>
                    <td><input disabled={itemClicked == school.id ? '' : 'disabled'} value={itemClicked == school.id ? schoolZip : school.zip} onChange={(e) => setSchoolZip(e.target.value)} type="text" /></td>
                    <td><input disabled={itemClicked == school.id ? '' : 'disabled'} value={itemClicked == school.id ? schoolCity : school.city} onChange={(e) => setSchoolCity(e.target.value)} type="text" /></td>
                    <td class={itemClicked == school.id ? school_styles.readable : school_styles.collapsed} ><textarea disabled={itemClicked == school.id ? '' : 'disabled'} value={itemClicked == school.id ? schoolContent : school.description} onChange={(e) => setSchoolContent(e.target.value)}></textarea></td>
                    <td>
                      {itemClicked == school.id ? (
                        <button>
                          <CheckIcon
                            className={school_styles.icon}
                            onClick={handleSubmit}
                          />
                          <ClearIcon
                            className={school_styles.icon}
                            onClick={HandleCancel}
                          />
                        </button>
                      ) : (
                          <div className={school_styles.OverButton}>
                            <button
                              className={school.id}
                              onClick={(e) => {
                                HandleEdit(e);
                                setInitaleValue(
                                  school.name,
                                  school.telefon,
                                  school.email,
                                  school.image,
                                  school.address,
                                  school.zip,
                                  school.city,
                                  school.description,
                                  school.id
                                );
                              }}
                            ></button>
                            <EditIcon className={school_styles.icon} />
                          </div>
                        )}
                      <div className={school_styles.OverButton}>
                        <button id={school.id} onClick={DeleteData}></button>
                        <DeleteForeverIcon className={school_styles.icon} />
                      </div>
                    </td>

                  </tr>
                );
              }
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  if (session.user.role == 'Admin') {
    return (<>
      {schoolData?.data.map((school, idx) => {
        return (<>
          { session.user.school_id == school.id ? <h1>{session.user.school_id} {school.id}</h1> : <h1>{session.user.school_id} {school.id}</h1>}
        </>)

      })}
    </>)
  }
};



export default Schools;
