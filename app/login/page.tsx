"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { credentialLogin } from "../lib/actions/auth";

export default function Login() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const onSubmit = async (data: FormData) => {
    setError(null);

    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const response = await credentialLogin({ email, password });

    if (response?.error) {
      setError(response.error); // ✅ This now contains the backend error message
      return;
    }

    if (response?.ok) {
      await update();
      router.push("/dashboard");
    }
  };

  if (status === "authenticated") return null;

  return (
    <div className="py-60 px-6">
      <form
        className="flex flex-col gap-5 max-w-[500px] mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(formData);
        }}
      >
        <input type="email" name="email" required />
        <input type="password" name="password" required />

        <button type="submit" className="bg-green-400">
          Submit
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
