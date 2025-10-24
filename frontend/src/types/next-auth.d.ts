declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      isNewUser?: boolean;
    }
    idToken?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isNewUser?: boolean;
    idToken?: string;
    accessToken?: string;
  }
}
