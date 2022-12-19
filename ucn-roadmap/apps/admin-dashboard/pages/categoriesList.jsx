import Categories from '../components/Categories';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Animate from '../components/Animate';

const CategoriesList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session.user.active) {
    router.push('/');
  }
  return (
    <>
      <Animate>
        <Categories />
      </Animate>
    </>
  );
};
CategoriesList.auth = true;
export default CategoriesList;
