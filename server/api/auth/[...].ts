import CredentialsProvider from "@auth/core/providers/credentials";
import type { AuthConfig } from "@auth/core/types";

import { NuxtAuthHandler } from "#auth";
import { hash } from "ohash";

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  callbacks: {
    jwt({ token, user }) {
      if (user) token.username = user.username;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
