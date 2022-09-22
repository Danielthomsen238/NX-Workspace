import { useRouter } from 'next/router';
import Login from '../../components/Login';
const Error = () => {
  const router = useRouter();
  const error = router.query.error;
  console.log(router.query);
  if (router.query.error == 'Request failed with status code 401') {
    const errorMessage = 'Du har taste forkert Email eller Kode';
    return <Login error={errorMessage} />;
  } else {
    return <Login />;
  }
};

export default Error;
