"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const credentialLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: email.toLowerCase(),
      password: password,
    });

    return res;
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          (error.cause as { err: { message?: string } })?.err.message ||
          "Authentication failed",
      };
    }

    return {
      error: "Something went wrong",
    };
  }
};
