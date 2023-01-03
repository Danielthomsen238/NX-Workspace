/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/jsx-no-duplicate-props */
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import school_styles from '../src/styles/school.module.css';

const Categories = () => {
  //States for user changes

  const { data: session, status } = useSession();
  const [runEffect, setRunEffect] = useState(false);
  const [categoryTitle, setCategory] = useState();
  const [itemClicked, setItemClicked] = useState();
  const [categoriesData, setData] = useState();
  //header config for api
  const config = {
    headers: { authorization: `Bearer ${session?.user.token}` },
  };

  //fetch data
  useEffect(() => {
    axios
      .get('https://sequelize-roadmap.herokuapp.com/Category', config)
      .then((response) => {
        setData(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [runEffect]);

  //submit function to update school
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: itemClicked,
      title: categoryTitle,
    };
    axios
      .put(`https://sequelize-roadmap.herokuapp.com/Category`, payload, config)
      .then((e, response) => {
        setRunEffect((state) => !state);
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
    setCategory();
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
        .delete(`https://sequelize-roadmap.herokuapp.com/Category`, payload)
        .then((response) => {
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

  //Admin jsx (only admin can see this)
  if (session.user.role == 'Admin') {
    return (
      <>
        <div className={school_styles.body}>
          <table className={school_styles.table}>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Handling</th>
              </tr>
            </thead>
            <tbody className={school_styles.ScrollAble}>
              {categoriesData?.data.map((category, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      <input
                        value={
                          itemClicked == category.id
                            ? categoryTitle
                            : category.title
                        }
                        type="text"
                        disabled={itemClicked == category.id ? '' : 'disabled'}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </td>

                    <td>
                      {itemClicked == category.id ? (
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
                            className={category.id}
                            onClick={(e) => {
                              HandleEdit(e);
                              setCategory(category.title);
                            }}
                          ></button>
                          <EditIcon className={school_styles.icon} />
                        </div>
                      )}
                      <div className={school_styles.OverButton}>
                        <button id={category.id} onClick={DeleteData}></button>
                        <DeleteForeverIcon className={school_styles.icon} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
};

export default Categories;
