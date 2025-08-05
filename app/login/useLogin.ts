"use client";
import { useSession } from "next-auth/react";
import { credentialLogin } from "../lib/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();

  const onSubmit = async (data: FormData) => {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    setIsLoading(true);
    setError(null);

    const response = await credentialLogin({ email, password });

    if (response?.error) {
      setError(response.error);
      setIsLoading(false);
      return;
    }

    await update();
    router.push("/dashboard");
  };

  return { error, isLoading, onSubmit };
}
