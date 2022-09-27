import Users from '../components/Users';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const UserList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session.user.active) {
    router.push('/');
  }
  return (
    <>
      <Users />
    </>
  );
};
UserList.auth = true;
export default UserList;
