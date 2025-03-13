import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { 
        params: { 
          scope: "https://www.googleapis.com/auth/calendar" 
        } 
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      session.user = { ...session.user, accessToken: token.accessToken };
      return session;
    },
    async jwt({ token, account }: { token: any, account: any }) {
      if (account) token.accessToken = account.access_token;
      return token;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
