import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const base_URL = process.env.base_URL;

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
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        user: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'otp', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials.password) {
          console.log(credentials.user.toLowerCase());
          const accessToken = await login(
            credentials.user.toLowerCase(),
            credentials.password
          );
          const payload = jwt_decode(accessToken.data.token);
          if (accessToken.data.token) {
            console.log(payload);
            return {
              userName: credentials.user,
              token: accessToken.data.token,
              userID: payload.user_id,
              firstname: payload.firstname,
              role_id: payload.role_id,
              role: payload.role,
              school_name: payload.school_name,
              hub: payload.hub,
              school_id: payload.school_id,
              otp: payload.otp,
              active: payload.active,
            };
          } else {
            console.log('error');
            return null;
          }
        } else if (credentials.otp) {
          const accessToken = await oneTimeLogin(
            credentials.user.toLowerCase(),
            credentials.otp
          );
          const payload = jwt_decode(accessToken.data.token);
          if (accessToken.data.token) {
            return {
              userName: credentials.user,
              token: accessToken.data.token,
              userID: payload.user_id,
              firstname: payload.firstname,
              role_id: payload.role_id,
              role: payload.role,
              hub: payload.hub,
              school_name: payload.school_name,
              school_id: payload.school_id,
              otp: payload.otp,
              active: payload.active,
            };
          } else {
            console.log('error');
            return null;
          }
        } else {
          console.log('error');
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    //save the information of the user in the jwt
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user.username = token.user.userName;
      session.user.token = token.user.token;
      session.user.userID = token.user.userID;
      session.user.firstname = token.user.firstname;
      session.user.role_id = token.user.role_id;
      session.user.role = token.user.role;
      session.user.hub = token.user.hub;
      session.user.school_name = token.user.school_name;
      session.user.school_id = token.user.school_id;
      session.user.otp = token.user.otp;
      session.user.active = token.user.active;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    error: '/login', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
});
//login funktion
const login = async (username, password) => {
  const data = {
    username,
    password,
  };
  try {
    const response = axios.post(
      'https://sequelize-roadmap.herokuapp.com/login',
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const oneTimeLogin = async (username, otp) => {
  const data = {
    username,
    otp,
  };
  try {
    const response = axios.post(
      'https://sequelize-roadmap.herokuapp.com/otp',
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
