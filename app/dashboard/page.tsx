"use client";

import { signOut } from "next-auth/react";

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col gap-3 max-w-[800px] mx-auto py-10 px-4 text-center">
      <p>DashboardPage</p>
      <button onClick={() => signOut()} className="cursor-pointer">
        Signout
      </button>
    </div>
  );
}
