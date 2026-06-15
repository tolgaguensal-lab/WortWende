import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login", error: "/login" },
  useSecureCookies: process.env.AUTH_SECURE_COOKIES !== "false",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.hashedPassword) return null;
        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }: { token: any; user: any; trigger?: any }) {
      if (user) {
        token.userId = user.id;
      }
      if (token.userId) {
        const profile = await prisma.userProfile.findUnique({ where: { userId: token.userId as string } });
        token.role = profile ? "USER" : "USER";
        token.placementLevel = profile?.placementLevel || null;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.placementLevel = token.placementLevel as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const nextAuth = NextAuth(authOptions);
export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
