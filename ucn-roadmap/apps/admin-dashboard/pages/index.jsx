import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

const Index = () => {
  const { data: session, status } = useSession();
  console.log(session)
 
  return (
    <>
      <h1>You are signed in as {session.user.username}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
Index.auth = true
export default Index;
