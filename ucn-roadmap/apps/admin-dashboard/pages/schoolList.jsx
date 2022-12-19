import Schools from '../components/Schools';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Animate from '../components/Animate';

const SchoolList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session.user.active) {
    router.push('/');
  }
  return (
    <>
      <Animate>
        <Schools />
      </Animate>
    </>
  );
};
SchoolList.auth = true;
export default SchoolList;
