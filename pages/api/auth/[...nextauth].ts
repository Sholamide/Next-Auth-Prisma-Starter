import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";
import { hashPassword, verifyPassword } from "../../../lib/bcrypt";
import { compare } from "bcryptjs";
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      id: "signin",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "iam@awesome.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          let maybeUser = await prisma.user.findFirst({
            where: {
              email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          });
          if (!maybeUser) {
            if (!password || !email) {
              throw new Error("Invalid Credentials");
            }
            maybeUser = await prisma.user.create({
              data: {
                email: email,
                password: await hashPassword(password),
              },
              select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
              },
            });
          } else {
            const isValid = await verifyPassword(password, maybeUser!.password);

            if (!isValid) {
              throw new Error("Invalid Credentials");
            }
          }
          return {
            id: maybeUser.id,
            email: maybeUser.email,
            name: maybeUser.name,
            role: maybeUser.role,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      id: "signup",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "iam@awesome.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          let maybeUser = await prisma.user.findFirst({
            where: {
              email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          });
          if (!maybeUser) {
            if (!password || !email) {
              throw new Error("Invalid Credentials");
            }
            maybeUser = await prisma.user.create({
              data: {
                email: email,
                password: await hashPassword(password),
              },
              select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
              },
            });
          } else {
            const isValid = await verifyPassword(password, maybeUser.password);

            if (!isValid) {
              throw new Error("Invalid Credentials");
            }
          }
          return {
            id: maybeUser.id,
            email: maybeUser.email,
            name: maybeUser.name,
            role: maybeUser.role,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    // signOut: '/',
    // error:'/auth/error',
    // signOut:'/auth/signout'
  },
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);

// const { email, password } = credentials as {
//   email: string;
//   password: string;
// };
// //perform login logic here
// //check if user exists in a database else cancel
// //authenticateUser()
// if (email !== "olamide@eha.ng" && password !== "password") {
//   throw new Error("Invalid Credentials");
// }
// //if everything is fine
// const user = { id: "1234", name: "Olamide", email: "olamide@eha.ng" };
// return user;
