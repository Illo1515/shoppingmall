import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const runtime = 'edge';

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  session: {
    strategy: "jwt", // CredentialsProvider를 위해 JWT 전략 사용
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 유저가 제공한 하드코딩된 어드민 정보 확인
        if (
          credentials?.username === "fhwktm" &&
          credentials?.password === "fhwktm123"
        ) {
          return {
            id: "admin-id",
            name: "관리자",
            email: "admin@ijeommu.com",
            isAdmin: true,
          };
        }
        return null;
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
});

