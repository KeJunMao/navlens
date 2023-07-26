import CredentialsProvider from "@auth/core/providers/credentials";
import type { AuthConfig } from "@auth/core/types";

import { NuxtAuthHandler } from "#auth";
import { hash } from "ohash";

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  callbacks: {
    jwt: async ({ token, user }) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.jwt = user ? (user as any).access_token || "" : "";
        token.id = user ? user.id || "" : "";
        token.username = user ? (user as any).username || "" : "";
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      (session as any).username = token.username;
      (session as any).uid = token.id;
      return Promise.resolve(session);
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(hash(credentials.password));
        const prisma = usePrisma();
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username as string,
            password: hash(credentials.password) as string,
          },
          select: {
            email: true,
            id: true,
            image: true,
            name: true,
            username: true,
          },
        });
        if (user) return user;

        return null;
      },
    }),
  ],
};

export default NuxtAuthHandler(authOptions, runtimeConfig);
