import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type UserRole = "STUDENT" | "LIBRARIAN" | "USER";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: UserRole;
    // ...other properties
  }
}

// Add custom JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
        // If token doesn't have role, fetch it from database
        if (!token.role) {
          try {
            const userFromDb = await db.query.users.findFirst({
              where: eq(users.id, token.id as string),
            });
            
            if (userFromDb && userFromDb.role) {
              token.role = userFromDb.role as UserRole;
            } else {
              // Default role if not found in DB
              token.role = "STUDENT";
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
            token.role = "STUDENT"; // Default fallback
          }
        }
        
        // Set role from token to session
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        
        // Use user.role if available, otherwise fetch from DB
        if (user.role) {
          token.role = user.role;
        } else {
          try {
            const userFromDb = await db.query.users.findFirst({
              where: eq(users.id, user.id),
            });
            token.role = (userFromDb?.role || "STUDENT") as UserRole;
          } catch (error) {
            console.error("Error in JWT callback:", error);
            token.role = "STUDENT"; // Default fallback
          }
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "STUDENT", // Default role for Google sign-ins
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Find the user in the database based on email.
        const [user] = await db
          .select()
          .from(users)
          .where(
            and(
              eq(users.email, credentials.email),
              eq(users.password, credentials.password)
            )
          );
        
        if (!user) {
          throw new Error("No user found with the given email");
        }

        // Return a user object on successful authentication.
        return {
          id: user.id,
          email: user.email,
          name: user.name || null,
          image: user.image || null,
          role: user.role as UserRole || "STUDENT",
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);