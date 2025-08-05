import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      token: string;
      name: string;
    };
  }

  interface User {
    email: string;
    token: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      email: string;
      token: string;
      name: string;
    };
  }
}
