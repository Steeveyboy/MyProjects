import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add user id to the session
      if (session.user) {
        session.user.id = (token as JWT & { sub: string }).sub!;
        session.user.isNewUser = token.isNewUser || false;
      }
      return session;
    },
    async jwt({ token, account, isNewUser }: { token: JWT; account: any; isNewUser?: boolean }) {
      // Pass isNewUser to the token
      if (isNewUser) {
        token.isNewUser = true;
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
