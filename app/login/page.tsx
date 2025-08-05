"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { credentialLogin } from "../lib/actions/auth";

export default function Login() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const onSubmit = async (data: FormData) => {
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    setIsLoading(true);
    setError(null);

    const response = await credentialLogin({ email, password });

    if (response?.error) {
      setError(response.error); // ✅ This now contains the backend error message
      setIsLoading(false);
      return;
    }

    if (response?.ok) {
      await update();
      router.push("/");
    }
  };

  if (status === "authenticated") return null;

  return (
    <div className="py-60 px-6 bg-black h-screen">
      <form
        className="flex flex-col gap-5 max-w-[500px] mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(formData);
        }}
      >
        <input
          type="email"
          name="email"
          required
          className="border-2 border-black-500 px-5 py-4 h-10 bg-white"
        />
        <input
          type="password"
          name="password"
          required
          className="border-2 border-black-500 px-5 py-4 h-10 bg-white"
        />

        <button type="submit" className="bg-green-400 h-10">
          {isLoading ? "Loading..." : "Submit"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
