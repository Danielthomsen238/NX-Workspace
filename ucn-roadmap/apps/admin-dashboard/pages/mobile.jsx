import mobile_styles from '../src/styles/mobil.module.css';

const Mobile = () => {
  return (
    <div className={mobile_styles.container}>
      <h1 className={mobile_styles.h1}>
        Du bliver desværre nød til at åben siden i en browser på en pc
      </h1>
    </div>
  );
};

export default Mobile;
