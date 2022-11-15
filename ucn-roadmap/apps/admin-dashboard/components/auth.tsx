import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Auth = ({ children }) => {
  const { data: session, status } = useSession();
  const [mobil, setMobil] = useState(false);
  const loading = status === 'loading';
  const hasUser = !!session?.user;
  const router = useRouter();

  useEffect(() => {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    setMobil(
      toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      })
    );
    if (mobil) {
      router.push('/mobile');
      return;
    }

    if (!loading && !hasUser) {
      router.push('/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A4200');
      return;
    }
  }, [loading, hasUser]);
  if (loading || !hasUser) {
    return (
      <>
        <div className="module-border-wrap">
          <div className="module"></div>
        </div>
      </>
    );
  }
  return <div>{children}</div>;
};

export default Auth;
