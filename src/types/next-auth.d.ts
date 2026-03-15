import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "ADMIN";
    language: "lt" | "en";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN";
      language: "lt" | "en";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN";
    language: "lt" | "en";
  }
}
