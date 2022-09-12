import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import jwt_decode from "jwt-decode"


export default NextAuth({
  //Configure JWT
  session: {
      jwt: true,
      maxAge: 60 * 60,
  },
  //Specify Provider
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // The credentials is used to generate a suitable form on the sign in page.
          // You can specify whatever fields you are expecting to be submitted.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            user: { label: "Username", type: "text", },
            password: {  label: "Password", type: "password" }
          },
          async authorize(credentials) {
             const accessToken = await login(credentials.user, credentials.password)
             const payload = jwt_decode(accessToken.data.token)
             console.log(payload)
             if(accessToken.data.token){
              return {userName: credentials.user, token: accessToken.data.token, userID: payload.user_id, firstname: payload.firstname, role_id: payload.role_id, role: payload.role}
             }else {
              console.log("error")
               return null
             }

          },
      }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    //save the information of the user in the jwt
    jwt: async ({ token, user }) => {
      
      user && (token.user = user)
      return token
  },
  session: async ({ session, token }) => {
    session.user.username = token.user.userName
    session.user.token = token.user.token
    session.user.userID = token.user.userID
    session.user.firstname = token.user.firstname
    session.user.role_id = token.user.role_id
    session.user.role = token.user.role
      return session
  }
    
  },
  pages: {
   //signIn: '/login/',
   // signOut: '/auth/signout',
   // error: '/auth/error', // Error code passed in query string as ?error=
   // verifyRequest: '/auth/verify-request', // (used for check email message)
   // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
});
//login funktion
const login = async (username, password) => {
  const data = {
    username,
    password
  }
  try {
    const response = axios.post('http://localhost:4000/login', data)
    return response
  } catch (error) {
    console.log(error)
  }
  
}