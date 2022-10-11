import Courses from '../components/Courses';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const CourseList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session.user.active) {
    router.push('/');
  }
  return <Courses />;
};
CourseList.auth = true;
export default CourseList;
