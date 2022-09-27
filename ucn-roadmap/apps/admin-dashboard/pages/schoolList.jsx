import Schools from '../components/Schools';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const SchoolList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session.user.active) {
    router.push('/');
  }
  return (
    <>
      <Schools />
    </>
  );
};
SchoolList.auth = true;
export default SchoolList;
