import axios, { AxiosError } from "axios";
import NextAuth from "next-auth";
import Credential from "next-auth/providers/credentials";

export type TLoginResponse = {
  email: string;
  token: string;
  name: string;
};

export const LOGIN_PATH = "/admin/auth/login";
export const BASE_URL = "https://crf-staging.thrindlebusiness.com";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  pages: {
    error: "/login",
    signIn: "/login",
    signOut: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 5,
  },

  secret: `${process.env.AUTH_SECRET}`,

  providers: [
    Credential({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as Record<
            "email" | "password",
            string
          >;

          const response = await axios.post(
            `${BASE_URL}${LOGIN_PATH}`,
            { email, password },
            {
              headers: { "Content-Type": "application/json" },
              timeout: 60000,
            }
          );

          const data: TLoginResponse = response.data.data;

          return {
            email: data.email,
            name: data.name,
            token: data.token,
          };
        } catch (err) {
          // ✅ Extract backend message and throw it
          if (err instanceof AxiosError) {
            const message =
              err.response?.data?.message ||
              err.response?.data?.error ||
              "Invalid email or password";
            throw new Error(message);
          }

          throw new Error("An unexpected error occurred");
        }
      },
    }),
  ],

  callbacks: {
    jwt: async ({ trigger, token, session, user, account }) => {
      // Initial sign-in: copy everything from `user` into the token
      if (user && account) {
        token.user = user;
      }

      // Manual session update: merge updated session.user fields into the token
      if (trigger === "update" && session?.user) {
        if (token.user) {
          token.user.email = session.user.email;
          token.user.token = session.user.token;
          token.user.name = session.user.name;
        } else {
          token.user = {
            email: session.user.email,
            token: session.user.token,
            name: session.user.name,
          };
        }
      }

      return token;
    },

    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        email: token?.user?.email ?? token?.email ?? null,
        token: token?.user?.token ?? null,
      };

      return session;
    },

    authorized: async ({ auth }) => {
      return !!auth;
    },

    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
