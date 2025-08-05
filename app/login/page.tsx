"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useLogin from "./useLogin";
import { useEffect } from "react";

export default function Login() {
  const { status } = useSession();
  const { error, isLoading, onSubmit } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

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
