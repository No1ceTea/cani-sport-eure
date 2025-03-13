import NextAuth, { NextAuthOptions, Session, Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

// ─── Étendre le type Session pour inclure accessToken ─────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    };
  }
}

// Déclarer authOptions sans l'exporter
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { scope: "https://www.googleapis.com/auth/calendar" },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.accessToken) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
  },
};

const authHandler = NextAuth(authOptions);

// Exporter uniquement les fonctions GET et POST
export const GET = authHandler;
export const POST = authHandler;
