import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_URL}/api/v1/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await res.json();

          if (!res.ok || !data.data?.accessToken) return null;

          return {
            id: data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email,
            accessToken: data.data.accessToken
          };
        } catch {
          return null;
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 // 24 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session.user as any).id = token.userId;
      return session;
    }
  },

  pages: {
    signIn: "/signin"
  },

  secret: process.env.NEXTAUTH_SECRET || "your-nextauth-secret-change-in-production"
};

export default NextAuth(authOptions);
