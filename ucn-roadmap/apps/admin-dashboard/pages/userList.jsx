import Users from '../components/Users';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Animate from '../components/Animate';

const UserList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session.user.active) {
    router.push('/');
  }
  return (
    <>
      <Animate>
        <Users />
      </Animate>
    </>
  );
};
UserList.auth = true;
export default UserList;
