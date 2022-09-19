import { useSession } from "next-auth/react"
import Users from "../components/Users"



const Index = () => {
    const { data: session, status } = useSession();
    console.log(session)

    return (
        <>
                <h1>Velkommen til Admin Dashboard for UCN Roadmap</h1>
                <p>Du logge er ind som Admin og har rettigheder til redigere alt</p>
        </>
    );
}
Index.auth = true
export default Index;