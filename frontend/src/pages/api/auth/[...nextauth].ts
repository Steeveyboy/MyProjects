import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      // Add user id to the session
      if (session.user) {
        session.user.id = (token as JWT & { sub: string }).sub!;
        session.user.isNewUser = token.isNewUser || false;

        (session as any).idToken = token.idToken;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, account, isNewUser }: { token: any; account: any; isNewUser?: boolean }) {
      // Pass isNewUser to the token
      if (isNewUser) {
        token.isNewUser = true;
      }
      else if (account) {
        // Add access token and id token to the JWT
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      // Add user id to the token
      else if (account?.provider === 'google') {
        token.sub = account.id; // Use the Google account ID as the sub
      }
      // Ensure the token is returned
      else if (!token.sub) {
        throw new Error("User ID (sub) is missing in the token");
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/welcome',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default handler;
